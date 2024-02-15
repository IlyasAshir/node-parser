import { error } from 'console';
import { initDatabase } from './db/init-database.js';
import { Config, Links } from './domains/config/index.js';
import { Link } from './domains/links/index.js';
import { Post } from './domains/post/index.js';
import { parseLinkQueue } from './domains/queues/parse-link-queue.js';
import { parsePostQueue } from './domains/queues/parse-post-queue.js';
import { sendTelegramMessageQueue } from './domains/queues/send-telegram-message-queue.js';
import { TelegramBot } from './domains/telegram-bot/index.js';
import cron from 'node-cron';
import { TLink } from './data/Link/index.js';
import { UserData } from './data/User/index.js';
import { message } from 'telegraf/filters';
import { PostData, PostType } from './data/Post/index.js';

const start = async (): Promise<void> => {
  sendTelegramMessageQueue.process('send-telegram-message-queue', async (job, done) => {
    try {
      const { chatId, message } = job.data;
      const response = await TelegramBot.sendMessagesToUsers({
        chatId,
        message,
      });

      // console.log(response);

      done(null);
    } catch (e: any) {
      console.log(e);
      done(new Error(e));
    }
  });
  sendTelegramMessageQueue.on('completed', (job, result) => {
    console.log(
      `Job ${job.id} completed with result: chat ID(${job.data.chatId}) tender ID(${job.data.message.tenderNumber} `,
    );
  });

  // Handle errors
  sendTelegramMessageQueue.on('error', (error) => {
    console.error('Queue error:', error);
  });

  parseLinkQueue.process('parse-links-queue', async (job, done) => {
    try {
      const { url } = job.data;

      const response = await Link.parseLinks(url);

      // console.log(response);

      done(null);
    } catch (e: any) {
      console.log(e);
      done(new Error(e));
    }
  });

  parseLinkQueue.on('completed', async (job, result) => {
    console.log(`Job ${job.id} completed with result: url(${job.data.url})  `);
    return job.data;
  });

  // Handle errors
  parseLinkQueue.on('error', (error) => {
    console.error('Queue error:', error);
  });

  parsePostQueue.process('parse-post-queue', async (job, done) => {
    try {
      // link.url = job.data;

      const response = await Post.parsePost(job.data);
      if (response === null) {
        throw new Error('post alredy exist');
      }

      done(null, response);
    } catch (e: any) {
      console.log(e);
      done(new Error(e));
    }
  });
  const users = await UserData.getUsers();

  parsePostQueue.on('completed', (job, result) => {
    users.map((user) => {
      TelegramBot.sendMessagesToUsers({ chatId: user.userID, message: result });
    });
    console.log(`Job ${job.id} completed with result: data(${job.data}) `);
  });

  // Handle errors
  parsePostQueue.on('error', (error) => {
    console.error('Queue error:', error);
  });

  const bot = new TelegramBot(Config.telegramApiToken);
  bot.init();

  // Schedule the task to run every 1 minute
  // cron.schedule('*/1 * * * *', async () => {
  //   await Links.map(async (data) => {
  //     Post.addToParselinksQueue(data.url);
  //   });
  //   await Post.parsePosts();
  // });
};

initDatabase({ main: true }).then(start);
