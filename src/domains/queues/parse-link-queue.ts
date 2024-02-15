import Queue from 'bull';
import { Config, UrlsType } from '../config/index.js';

// import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export const parseLinkQueue = new Queue<UrlsType>('parse-links-queue', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
    // You can specify other Redis options here if needed
  },
});
