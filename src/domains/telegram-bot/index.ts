import { Post } from '../post/index.js';
import { PostData, PostType } from '../../data/Post/index.js';
import { UserData } from '../../data/User/index.js';
import { Telegraf } from 'telegraf';
import { Config, Links, ParsingObj } from '../config/index.js';
import { link } from 'node:fs';
import { sendTelegramMessageQueue } from '../queues/send-telegram-message-queue.js';
import { parseLinkQueue } from '../queues/parse-link-queue.js';

export type TelegramBotSendMessageOptionsType = {
  chatId: string;
  message: PostType;
};

export class TelegramBot {
  public bot: Telegraf;
  parse: ParsingObj;
  post: Post;
  constructor(telegramApiToken: string) {
    this.bot = new Telegraf(telegramApiToken);
    this.post = new Post();
    this.bot.telegram
      .setMyCommands([
        { command: '/get_data', description: 'Получть послении обьявления' },
        { command: '/help', description: 'Помощь' },
        { command: '/end', description: 'Отключить бот' },
      ])
      .then(() => {
        console.log('Commands set sucessfully');
      })
      .catch((err) => {
        console.error('Error setting commands:', err);
      });
    this.parse = {
      tenderNumber: '',
      tenderName: '',
      tenderStatus: '',
      publicationDate: new Date(),
      applicationStartDate: new Date(),
      applicationEndDate: new Date(),
      link: '',
    };
  }

  // public init() {
  //   const post = new Post();
  //   this.bot.start((ctx) => {
  //     ctx.reply('Добро пожаловать, ');
  //     UserData.saveNewUser(ctx.message.chat.id.toString(), ctx.message.from.username!)
  //       .then((data) => console.log(data))
  //       .catch((err) => console.log(`error while creating new user ${err}`));
  //   });
  //   this.bot.hears('/get_data', (ctx) => {
  //     ctx.reply('fetching data.....');
  //     post.getPosts().then((data) =>
  //       data.forEach((obj) => {
  //         ctx.reply(
  //           ` Номер объявления: ${obj.tenderNumber}\n Наименование объявления: ${obj.tenderName}\n Статус объявления: ${obj.tenderStatus}\n Дата публикации объявления: ${obj.publicationDate}\n Срок начала обсуждения: ${obj.applicationStartDate}\n Срок окончания обсуждения: ${obj.applicationEndDate}\n Ссылка: ${obj.link}`,
  //         );
  //       }),
  //     );
  //   });
  //   this.bot.launch();

  //   // Enable graceful stop
  //   process.once('SIGINT', () => this.bot.stop('SIGINT'));
  //   process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  // }
  public init() {
    const post = new Post();

    // Start command handler
    this.bot.start(async (ctx) => {
      try {
        await ctx.replyWithMarkdown(
          'Добро пожаловать, здесь вы можете получать ___уведелмления___ о новых тендерах по ***категориям*** и ___поиск___ по ***категориям***.',
        );
        await ctx.replyWithMarkdown('***Категории***: по ___областям___, ___цене___ и ___ключевым словам___.');
        const data = await UserData.saveNewUser(ctx.message.chat.id.toString(), ctx.message.from.username!);
        console.log(data);
      } catch (err) {
        console.error(`Error while creating new user: ${err}`);
      }
    });

    // Command handler for '/get_data'
    this.bot.hears('/get_data', async (ctx) => {
      try {
        await ctx.reply('Fetching data.....');
        const data = await post.getPosts();
        data.forEach((obj) => {
          this.addToMessageQueue(ctx.chat.id.toString(), obj);

          // ctx.reply(
          //   ` Номер объявления: ${obj.tenderNumber}\n Наименование объявления: ${obj.tenderName}\n Статус объявления: ${obj.tenderStatus}\n Дата публикации объявления: ${obj.publicationDate}\n Срок начала обсуждения: ${obj.applicationStartDate}\n Срок окончания обсуждения: ${obj.applicationEndDate}\n Ссылка: ${obj.link}`,
          // );
        });
      } catch (err) {
        console.error(`Error while fetching data: ${err}`);
        ctx.reply('Error fetching data. Please try again later.');
      }
    });

    this.bot.hears('/help', async (ctx) => {
      try {
        await ctx.reply(
          '/get_data - введите сколько последних обьявлений вы хотите получить (1-50)\n/set_search_filtres - поключить фильтры для поиска\n/set_notification_filtres - поключить фильтры для получения обьявлений',
        );
      } catch (err) {
        console.error(`Error while fetching data: ${err}`);
        ctx.reply('Error fetching data. Please try again later.');
      }
    });

    // Launch the bot
    this.bot.launch();

    // Graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  public async addToMessageQueue(chatId: string, message: PostType) {
    try {
      await sendTelegramMessageQueue.add('send-telegram-message-queue', { chatId, message });
    } catch (error) {
      console.error(`Error adding message to the queue: chat ID(${chatId}) tender ID(${message.tenderNumber})`);
      throw error; // Propagate the error to handle it elsewhere
    }
  }

  public static async sendMessagesToUsers(options: TelegramBotSendMessageOptionsType) {
    const bot = new Telegraf(Config.telegramApiToken);

    return bot.telegram.sendMessage(
      options.chatId,
      `*Номер объявления:*\n_${options.message.tenderNumber}_\n*Наименование объявления:*\n_${options.message.tenderName}_\n*Статус объявления:*\n_${options.message.tenderStatus}_\n*Дата публикации объявления:*\n_${options.message.publicationDate.toLocaleString('en-GB')}_\n*Дата начала объявления:*\n_${options.message.applicationStartDate.toLocaleString('en-GB')}_\n*Срок окончания обсуждения*:\n_${options.message.applicationEndDate.toLocaleString('en-GB')}_\n*Ссылка:*\n${options.message.link}`,
      { parse_mode: 'Markdown' },
    );
  }

  public async getPosts() {
    this.post.getPosts();
    console.log(this.post);
  }
}
