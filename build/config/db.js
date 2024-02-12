import mongoose from 'mongoose';
const mongoURL = 'mongodb+srv://iashir:Forgespirit05@cluster0.gq78ifm.mongodb.net/';
export default async function connectDB() {
    try {
        console.log('test');
        const connect = await mongoose.connect(mongoURL);
        console.log(`MongoDb Connected: ${connect.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map