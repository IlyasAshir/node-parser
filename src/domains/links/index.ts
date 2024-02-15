import axios from 'axios';
import * as cheerio from 'cheerio';
import { Elements, ParsingObj, ParsingArr, httpsAgent, UrlsType } from '../config/index.js';
import Bull from 'bull';
import { parseLinkQueue } from '../queues/parse-link-queue.js';
import { UserData } from '../../data/User/index.js';
import { LinkData } from '../../data/Link/index.js';

export class Link {
  user: UserData;
  constructor() {
    this.user = new UserData();
  }

  public static async parseLinks(url: string): Promise<void> {
    try {
      await LinkData.deleteAllLinks();
      const linkArr: Array<UrlsType> = [];
      const response = await axios.get(url, { httpsAgent });
      const html = response.data;
      const $ = cheerio.load(html);

      const linksHTML = $('#search-result tbody tr td:nth-child(2) a');
      const path = `https://www.goszakup.gov.kz`;

      // Iterate through each link
      linksHTML.each((index, element) => {
        // Extract text content from the link
        const url = $(element).attr('href');
        if (url) {
          const completeUrl = path + url;
          LinkData.save({ url: completeUrl });
          //   Link.linkArr.push({ url: completeUrl });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static async addToParselinksQueue(link: string): Promise<any> {
    try {
      const result = await parseLinkQueue.add('parse-links-queue', { url: link });
      return result;
    } catch (error) {
      console.error(`Error adding parse link to the queue: Link(${link})`);
      throw error; // Propagate the error to handle it elsewhere
    }
  }
}
