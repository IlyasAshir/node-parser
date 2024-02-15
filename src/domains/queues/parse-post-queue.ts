import Queue from 'bull';
import { Config, ParsingObj } from '../config/index.js';
import { TLink } from '../../data/Link/index.js';

// import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

export const parsePostQueue = new Queue<TLink>('parse-post-queue', {
  redis: {
    port: 6379,
    host: '127.0.0.1',
    // You can specify other Redis options here if needed
  },
});
