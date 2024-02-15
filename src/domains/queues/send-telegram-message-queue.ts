import Queue from 'bull';
import { Config } from '../config/index.js';
import { PostType } from '../../data/Post/index.js';

// import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

type JobType = {
  chatId: string;
  message: PostType;
};

export const sendTelegramMessageQueue = new Queue<JobType>('send-telegram-message-queue', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
    // You can specify other Redis options here if needed
  },
});
