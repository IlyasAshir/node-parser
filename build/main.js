import connectDB from './config/db.js';
import { PostModel } from './db/Post.js';
import { parseData } from './middleware/parseData.js';
const urls = [
    { url: 'https://www.goszakup.gov.kz/ru/announce/index/11581183' },
    { url: 'https://www.goszakup.gov.kz/ru/announce/index/11581175' },
    { url: 'https://www.goszakup.gov.kz/ru/announce/index/11581174' },
    { url: 'https://www.goszakup.gov.kz/ru/announce/index/11581139' },
    { url: 'https://www.goszakup.gov.kz/ru/announce/index/11581138' },
];
const startParsing = async () => {
    await connectDB();
    urls.forEach((element) => {
        parseData(element.url).then((data) => {
            console.log(data);
            PostModel.create(data)
                .then((res) => console.log('success'))
                .catch(console.log);
        });
    });
};
startParsing();
//# sourceMappingURL=main.js.map