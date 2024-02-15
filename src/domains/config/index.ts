import https from 'node:https';

export const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // (NOTE: this will disable client verification)
});

type TConfig = {
  mainMongoConnectionUrl: string;
  telegramApiToken: string;
  redisUrl: string;
};

type TLink = {
  url: string;
};

export type UrlsType = { url: string };

export interface ParsingObj {
  tenderNumber: string;
  tenderName: string;
  tenderStatus: string;
  publicationDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
  link: string;
}
export type ParsingArr = Array<ParsingObj>;

export type TElement = {
  tenderNumber: string;
  tenderName: string;
  tenderStatus: string;
  publicationDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
  link: string;
};

export const Config: TConfig = {
  mainMongoConnectionUrl: 'mongodb+srv://iashir:Forgespirit05@cluster0.gq78ifm.mongodb.net/',
  telegramApiToken: '6831508154:AAG2S-nQzAbsSJEXfoVSK6Cf0gW23APoOU4',
  redisUrl: '127.0.0.1:6379',
};

export const Links: Array<TLink> = [{ url: 'https://www.goszakup.gov.kz/ru/search/announce' }];


//js path для парсинга данных 
export const Elements: TElement = {
  tenderNumber:
    '#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(1) > div > input',
  tenderName:
    '#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(3) > div > input',
  tenderStatus:
    '#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(5) > div > input',
  publicationDate:
    '#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(7) > div > input',
  applicationStartDate:
    '#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(2) > div:nth-child(1) > div > input',
  applicationEndDate:
    '#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(2) > div:nth-child(3) > div > input',
  link: '',
};
