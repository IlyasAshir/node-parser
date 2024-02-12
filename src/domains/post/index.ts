import axios from 'axios';
import * as cheerio from 'cheerio';
import { Elements, ParsingObj, ParsingArr, httpsAgent, UrlsType } from '../config/index.js';
import { PostData, FindByStatusType, PostType } from '../../data/index.js';
import { PostModel } from '../../db/Post/index.js';

export class Post {
  parseArr: ParsingArr;
  linkArr: Array<any>;
  latestPostCheck: Date;
  constructor() {
    this.linkArr = [];
    this.parseArr = [];
    this.latestPostCheck = new Date();
  }

  public async parseLinks(): Promise<UrlsType[]> {
    try {
      const response = await axios.get('https://www.goszakup.gov.kz/ru/search/announce', { httpsAgent });
      const html = response.data;
      const $ = cheerio.load(html);

      const links = $('#search-result tbody tr td:nth-child(2) a');
      const path = `https://www.goszakup.gov.kz/`;

      // Iterate through each link
      links.each((index, element) => {
        // Extract text content from the link
        const url = $(element).attr('href');
        if (url) {
          const completeUrl = path + url;
          this.linkArr.push({ url: completeUrl });
        }
      });
    } catch (error) {
      console.log(error);
    }
    return this.linkArr;
  }

  // public async parsePosts(links: UrlsType[]): Promise<ParsingArr> {
  //   try {
  //     let $: any;
  //     const { createdAt } = await PostData.getLatestPost();
  //     this.latestPostCheck = createdAt;
  //     const existingPostNumbers = await PostData.getExistingPostsID();

  //     if (links) {
  //       await Promise.all(
  //         links.map((link) => {
  //           axios.get(link.url, { httpsAgent }).then((res) => {
  //             $ = cheerio.load(res.data);
  //             let parseObj: ParsingObj = {
  //               tenderNumber: $(Elements.tenderNumber).val(),
  //               tenderName: $(Elements.tenderName).val(),
  //               tenderStatus: $(Elements.tenderStatus).val(),
  //               publicationDate: $(Elements.publicationDate).val(),
  //               applicationStartDate: $(Elements.applicationStartDate).val(),
  //               applicationEndDate: $(Elements.applicationEndDate).val(),
  //               link: link.url,
  //             };
  //             // const check = existingPostNumbers.find((id) => id === parseObj.tenderNumber);
  //             const check = existingPostNumbers.includes(parseObj.tenderNumber);
  //             if (check) {
  //               console.log(`Tender ${parseObj.tenderNumber} Already exist`);
  //             } else {
  //               this.parseArr.push(parseObj);
  //               PostData.save(parseObj)
  //                 .then((data) => console.log(`Success! \n ${data}`))
  //                 .catch((e) => console.log(`unable to save post: ${parseObj.tenderName}, ${parseObj.tenderNumber}`));
  //             }
  //           });
  //         }),
  //       );
  //     }

  //     console.log(`parseArr check in parsePosts func: ${this.parseArr}`);
  //     return this.parseArr;
  //   } catch (error) {
  //     console.log('parse psot func ERROR');
  //     throw error; // Propagate the error so the caller can handle it
  //   }
  // }

  public async parsePosts(links: UrlsType[]): Promise<ParsingArr> {
    try {
      let $: any;
      const { createdAt } = await PostData.getLatestPost();
      this.latestPostCheck = createdAt;
      const existingPostNumbers = await PostData.getExistingPostsID();
      console.log(`last post Date: ${this.latestPostCheck}`);
      const promises = links.map(async (link) => {
        try {
          const res = await axios.get(link.url, { httpsAgent });
          $ = cheerio.load(res.data);
          const parseObj: ParsingObj = {
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
            console.log(`Success! \n ${parseObj}`);
            return parseObj;
          } else {
            console.log(`Tender ${parseObj.tenderNumber} Already exists`);
            return null;
          }
        } catch (error) {
          console.error('Error parsing post:', error);
          throw error;
        }
      });
      const parsedPosts = await Promise.all(promises);
      this.parseArr = parsedPosts.filter((post) => post !== null) as ParsingArr;
      console.log(`parseArr check in parsePosts func: ${JSON.stringify(this.parseArr)}`);
      return this.parseArr;
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

  public async getAllLinks(): Promise<void> {}

  public async getNewPosts(): Promise<any> {
    console.log(`latest post date: ${this.latestPostCheck}`);

    const newItems = await PostData.checkForNewItems(this.latestPostCheck);
    // Process the new items
    if (newItems.length > 0) {
      console.log(`new items length: ${newItems.length}`);
      console.log(`new items: ${newItems}`);
      return newItems;
    } else {
      console.log('No new items added.');
    }
    // return newItems;
  }
}
