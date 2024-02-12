import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'node:https';
export async function parseData(url) {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });
    try {
        let res = await axios.get(url, { httpsAgent });
        let $ = await cheerio.load(res.data);
        const tenderNumber = $('#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(1) > div > input').val();
        const tenderName = $('#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(3) > div > input').val();
        const tenderStatus = $('#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(5) > div > input').val();
        const publicationDate = $('#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(1) > div:nth-child(7) > div > input').val();
        const publicationStartDate = $('#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(2) > div:nth-child(1) > div > input').val();
        const publicationEndDate = $('#main-wrapper > div.content-block > div.panel.panel-default > div.panel-body > div.row > div:nth-child(2) > div:nth-child(3) > div > input').val();
        return {
            tenderNumber: tenderNumber,
            tenderName: tenderName,
            tenderStatus: tenderStatus,
            publicationDate: publicationDate,
            applicationStartDate: publicationStartDate,
            applicationEndDate: publicationEndDate,
        };
    }
    catch (error) {
        console.log(error);
    }
}
//# sourceMappingURL=parseData.js.map