import { Post } from '../post/index.js';
import { PostData, PostType, UserData } from '../../data/index.js';
import { Telegraf } from 'telegraf';
import { ParsingObj } from '../config/index.js';
import { link } from 'node:fs';

export type TelegramBotSendMessageOptionsType = {
  telegramApiToken: string;
  chatId: string | number;
  message: string;
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
        { command: '/start', description: 'Запустить бот' },
        { command: '/get_data', description: 'последнии 50 постов' },
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
        await ctx.reply('Добро пожаловать, ');
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
          ctx.reply(
            ` Номер объявления: ${obj.tenderNumber}\n Наименование объявления: ${obj.tenderName}\n Статус объявления: ${obj.tenderStatus}\n Дата публикации объявления: ${obj.publicationDate}\n Срок начала обсуждения: ${obj.applicationStartDate}\n Срок окончания обсуждения: ${obj.applicationEndDate}\n Ссылка: ${obj.link}`,
          );
        });
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

  public async getPosts() {
    this.post.getPosts();
    console.log(this.post);
  }

  public async refreshPosts() {
    try {
      const links = await this.post.parseLinks();
      const newPosts = await this.post.parsePosts(links);
      if (newPosts.length > 0) {
        const newData = await this.post.getNewPosts();

        if (newData) {
          console.log(`refresh posts func --- ${newData}`);
          this.sendMessagesToUsers(newData);
        }
      } else {
        console.log(`refreshPosts func: no new posts found`);
      }
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  }

  public async sendMessagesToUsers(data: PostType[]) {
    try {
      console.log(data);
      // Get a list of user IDs from your database or any other data source
      // Send a message to each user
      data.map((post) => {
        UserData.getUsers().then((users) => {
          for (const user of users) {
            this.bot.telegram.sendMessage(
              user.userID,
              ` Номер объявления: ${post.tenderNumber}\n  Наименование объявления: ${post.tenderName}\n Статус объявления: ${post.tenderStatus}\n  Дата публикации объявления: ${post.publicationDate}\n  Срок начала обсуждения: ${post.applicationStartDate}\n  Срок окончания обсуждения: ${post.applicationEndDate}\n Ссылка: ${post.link}}`,
            );
          }
        });
      });
    } catch (error) {
      console.error('Error sending messages to users:', error);
    }
  }
}
