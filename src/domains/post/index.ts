import axios from 'axios';
import * as cheerio from 'cheerio';
import { Elements, ParsingObj, ParsingArr, httpsAgent, UrlsType } from '../config/index.js';
import { PostData, FindByStatusType, PostType } from '../../data/Post/index.js';
import Bull from 'bull';
import { parseLinkQueue } from '../queues/parse-link-queue.js';
import { parsePostQueue } from '../queues/parse-post-queue.js';
import { LinkData, TLink } from '../../data/Link/index.js';

export class Post {
  constructor() {}

  // public async parseLinks(): Promise<UrlsType[]> {
  //   try {
  //     const response = await axios.get('https://www.goszakup.gov.kz/ru/search/announce', { httpsAgent });
  //     const html = response.data;
  //     const $ = cheerio.load(html);

  //     const links = $('#search-result tbody tr td:nth-child(2) a');
  //     const path = `https://www.goszakup.gov.kz`;

  //     // Iterate through each link
  //     links.each((index, element) => {
  //       // Extract text content from the link
  //       const url = $(element).attr('href');
  //       if (url) {
  //         const completeUrl = path + url;
  //         console.log(completeUrl);
  //         this.linkArr.push({ url: completeUrl });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   return this.linkArr;
  // }

  // public async parsePosts(links: UrlsType[]): Promise<ParsingArr> {
  //   try {
  //     let $: any;
  //     const { createdAt } = await PostData.getLatestPost();
  //     this.latestPostCheck = createdAt;
  //     const existingPostNumbers = await PostData.getExistingPostsID();
  //     console.log(`last post Date: ${this.latestPostCheck}`);
  //     const promises = links.map(async (link) => {
  //       try {
  //         const res = await axios.get(link.url, { httpsAgent });
  //         $ = cheerio.load(res.data);
  //         const parseObj: ParsingObj = {
  //           tenderNumber: $(Elements.tenderNumber).val(),
  //           tenderName: $(Elements.tenderName).val(),
  //           tenderStatus: $(Elements.tenderStatus).val(),
  //           publicationDate: $(Elements.publicationDate).val(),
  //           applicationStartDate: $(Elements.applicationStartDate).val(),
  //           applicationEndDate: $(Elements.applicationEndDate).val(),
  //           link: link.url,
  //         };

  //         const check = existingPostNumbers.includes(parseObj.tenderNumber);
  //         if (!check) {
  //           await PostData.save(parseObj);
  //           console.log(`Success! ${parseObj.tenderNumber}`);
  //           return parseObj;
  //         } else {
  //           console.log(`Tender ${parseObj.tenderNumber} Already exists`);
  //           return null;
  //         }
  //       } catch (error) {
  //         console.error('Error parsing post:', error);
  //       }
  //     });
  //     const parsedPosts = await Promise.all(promises);
  //     this.parseArr = parsedPosts.filter((post) => post !== null) as ParsingArr;
  //     // console.log(`parseArr check in parsePosts func: ${JSON.stringify(this.parseArr)}`);
  //     return this.parseArr;
  //   } catch (error) {
  //     console.error('parse post func ERROR', error);
  //     throw error; // Propagate the error so the caller can handle it
  //   }
  // }

  public static async parsePost(link: TLink): Promise<PostType | null> {
    try {
      console.log('URL  ', link.url);
      const existingPostNumbers = await PostData.getExistingPostsID();

      let $: any;
      const res = await axios.get(link.url, { httpsAgent });
      $ = cheerio.load(res.data);
      const parseObj: PostType = {
        tenderNumber: $(Elements.tenderNumber).val(),
        tenderName: $(Elements.tenderName).val(),
        tenderStatus: $(Elements.tenderStatus).val(),
        publicationDate: $(Elements.publicationDate).val(),
        applicationStartDate: $(Elements.applicationStartDate).val(),
        applicationEndDate: $(Elements.applicationEndDate).val(),
        link: link.url,
      };

      const check = existingPostNumbers.includes(parseObj.tenderNumber);
      if (!check) {
        await PostData.save(parseObj);
        return parseObj;
      } else {
        return null;
      }
    } catch (error) {
      console.log('error while parsing post');
      throw error;
    }
  }

  public static async parsePosts(): Promise<void> {
    try {
      const links = await LinkData.getAllLinks();
      links.map(async (link) => {
        await this.addToParsePostQueue({ url: link.url });
      });
      // const parsedPosts = await Promise.all(promises);
      // parseArr = parsedPosts.filter((post) => post !== null) as ParsingArr;
      // console.log(`parseArr check in parsePosts func: ${JSON.stringify(this.parseArr)}`);
      // return parseArr;
    } catch (error) {
      console.error('parse post func ERROR', error);
      throw error; // Propagate the error so the caller can handle it
    }
  }
  public async getPosts(): Promise<any[]> {
    return PostData.getAllPosts();
  }

  public findById(id: string) {
    PostData.findOne({ tenderNumber: id })
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  }

  public findByStatus(status: FindByStatusType) {
    PostData.findByStatus(status);
  }

  public async getNewPosts(createdAt: Date): Promise<PostType[]> {
    console.log(`latest post date: ${createdAt}`);
    const newItems = await PostData.checkForNewItems(createdAt);
    // Process the new items
    if (newItems.length > 0) {
      console.log(`new items length: ${newItems.length}`);
      return newItems;
    } else {
      console.log('No new items added.');
      return [];
    }
    // return newItems;
  }

  public static async addToParsePostQueue(link: TLink) {
    try {
      await parsePostQueue.add('parse-post-queue', link);
    } catch (error) {
      console.error(`Error adding parse post to the queue`);
      throw error; // Propagate the error to handle it elsewhere
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
