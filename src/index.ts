import { initDatabase } from './db/init-database.js';
import { Config } from './domains/config/index.js';
import { TelegramBot } from './domains/telegram-bot/index.js';
import cron from 'node-cron';

const start = async (): Promise<void> => {
  const bot = new TelegramBot(Config.telegramApiToken);
  bot.init();
  // Schedule the task to run every 15 minutes
  cron.schedule('*/1 * * * *', async () => {
    await bot.refreshPosts();
  });
};

initDatabase({ main: true }).then(start);
