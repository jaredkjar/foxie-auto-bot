import * as tmi from 'tmi.js';

import ChromeWebDriver from '../services/webdriver';

import { getVideoId, getNumberWithOrdinal, AuthenticationFailure } from '../services/helpers';

interface BotInterface {
  code: string;
  channel: string;
}

export const initBot = ({ code, channel }: BotInterface) => {
  try {
    const client = new tmi.Client({
      channels: [channel],
      identity: {
        username: 'FoxieAutoBot',
        password: `oauth:${code}`,
      },
    });
    client.connect().catch(() => {
      console.log('Unable to authenticate. Please obtain a new oAuth token by going to /');
    });

    const driver = new ChromeWebDriver();

    client.on('message', async (channel, tags, message, isSelf) => {
      if (!isSelf) {
        const user = tags?.['display-name'];
        const isAdmin = tags?.badgets?.moderator || tags?.badges?.broadcaster || false;
        if (tags?.['first-msg']) {
          client.say(channel, `Welcome to the chat, @${user}!`);
        }
        if (message.includes('!skip')) {
          if (isAdmin) {
            driver.skip();
          } else {
            client.say(channel, `@${user}, only moderators can use that.`);
          }
        }
        if (message.includes('!clear')) {
          if (isAdmin) {
            driver.clear();
          } else {
            client.say(channel, `@${user}, only moderators can use that.`);
          }
        }
        if (message.includes('!play')) {
          const videoId = getVideoId(message);
          if (videoId !== 'invalid video id') {
            const number = driver.addVideoToQueue({ videoId, user, isAdmin });
            if (number !== 0) {
              if (number === -1) {
                client.say(channel, `@${user}, sorry the queue is full right now.`);
              } else if (number === 1) {
                client.say(channel, `@${user}, your video will play next!`);
              } else if (number === 999) {
                client.say(channel, `@${user}, you have already submitted a video.`);
              } else {
                client.say(channel, `@${user}, your video is ${getNumberWithOrdinal(number)} in line.`);
              }
            }
          } else {
            client.say(channel, `I'm sorry, that does not look like a valid youtube link @${user}.`);
          }
        }
      }
    });
  } catch (err) {
    //pass up auth error to the server.ts
    if (err instanceof AuthenticationFailure) {
      throw err;
    }
  }
};
