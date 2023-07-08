export interface VideoQueueInterface {
  user: string;
  videoId: string;
}

interface queueInterface {
  enQueue(dataItem: VideoQueueInterface): void;
  deQueue(): VideoQueueInterface | undefined;
  isEmpty(): boolean;
  isFull(): boolean;
  length(): number;
  printQueue(): void;
  peek(): VideoQueueInterface;
  userHasSubmitted(user: string): boolean;
  clear(): void;
}

export class VideoQueue implements queueInterface {
  private QueueData: Array<VideoQueueInterface> = [];
  private maxSize = 0;

  constructor(length: number) {
    this.maxSize = length;
  }

  isEmpty(): boolean {
    const result = this.QueueData.length <= 0;
    return result;
  }

  isFull(): boolean {
    const result = this.QueueData.length >= this.maxSize;
    return result;
  }

  enQueue(dataItem: VideoQueueInterface): void {
    if (this.isFull()) {
      console.log('The queue is full!');
    } else {
      this.QueueData.push(dataItem);
    }
  }

  deQueue(): VideoQueueInterface | undefined {
    if (!this.isEmpty()) {
      const element = this.QueueData.shift();
      return element;
    }
  }

  length(): number {
    const len = this.QueueData.length;
    return len;
  }

  printQueue(): void {
    for (let i = 0; i < this.QueueData.length; i++) {
      console.log(this.QueueData[i]);
    }
  }

  peek(): VideoQueueInterface {
    return this.QueueData[0];
  }

  userHasSubmitted(user: string): boolean {
    if(this.isEmpty()){
      return false;
    }
    return this.QueueData.some(item => item.user === user);
  }

  clear(): void {
    this.QueueData = [];
  }
}
