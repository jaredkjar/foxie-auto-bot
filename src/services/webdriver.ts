import path from 'path';
import { ServiceBuilder, Options } from 'selenium-webdriver/chrome';
import { Builder, By, until } from 'selenium-webdriver';
import { VideoQueue, VideoQueueInterface } from '../data-structures/VideoQueue';

interface addVideoInterface extends VideoQueueInterface {
  isAdmin: boolean;
}

export default class ChromeWebDriver {
  private seleniumDriver;
  private isOpen;
  public videoQueue;
  public isPlaying;
  private player;
  private currentPlayingVideo: VideoQueueInterface = { user: 'no one', videoId: 'nothing' };

  constructor() {
    this.videoQueue = new VideoQueue(15);
  }

  public async initDriver(): Promise<void> {
    const chromeDriverPath = path.join(__dirname, '../../', 'chromedriver');
    const serviceBuilder = new ServiceBuilder(chromeDriverPath);

    const seleniumDriver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(serviceBuilder)
      .setChromeOptions(new Options().windowSize({ width: 820, height: 745 }))
      .build();
    this.seleniumDriver = seleniumDriver;
    this.isOpen = true;
    this.seleniumDriver.executeScript("document.title = 'youtube_video_window_to_grab'");
  }

  private async openVideo(watchId): Promise<void> {
    if (!this.isOpen) {
      console.log('new window')
      await this.initDriver();
    }
    this.seleniumDriver.get(`https://hopollo.github.io/OBS-Youtube-Player/?watch?v=${watchId}&volume=35&w=800&h=600&hideWhenStopped=true`);
    this.clickVideo();
  }

  public addVideoToQueue({ videoId, user, isAdmin }: addVideoInterface): number {
    if (this.videoQueue.isFull()) {
      return -1;
    }
    if (!isAdmin && (this.videoQueue.userHasSubmitted(user) || this.currentPlayingVideo.user === user)) {
      return 999;
    }
    if (this.videoQueue.length() === 0 && !this.isPlaying) {
      this.openVideo(videoId);
    }
    this.videoQueue.enQueue({ videoId, user });
    this.currentPlayingVideo = { user: 'no one', videoId: 'nothing' };
    return this.videoQueue.length();
  }

  private async clickVideo(): Promise<void> {
    try {
      this.player = await this.seleniumDriver.findElement(By.id('player'));
      this.player.click();
      this.isPlaying = true;
      this.currentPlayingVideo = this.videoQueue.deQueue();
      this.waitForVideoToEndAndPlayNext();
    } catch (err) {
      this.closePlayer();
      console.log(err);
    }
  }

  private async waitForVideoToEndAndPlayNext(): Promise<void> {
    try {
      await this.seleniumDriver.wait(until.elementIsNotVisible(this.player));
      this.isPlaying = false;
      if (this.videoQueue.isEmpty()) {
        this.closePlayer();
        return;
      }
      const nextVideo = this.videoQueue.peek();
      this.openVideo(nextVideo.videoId);
    } catch (err) {
      //ignore waiting errors, just return
      return;
    }
  }

  private closePlayer(): void {
    this.seleniumDriver.close();
    this.isOpen = false;
    this.currentPlayingVideo = { user: 'no one', videoId: 'nothing' };
  }

  public skip(): void {
    this.isPlaying = false;
    if(this.videoQueue.isEmpty()){
      this.closePlayer();
    }
    else {
      const nextVideo = this.videoQueue.peek();
      this.openVideo(nextVideo.videoId);
    } 
  }

  public clear(): void {
    this.videoQueue.clear();
    this.isPlaying = false;
    this.closePlayer();
  }
}
