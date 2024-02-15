import { Document, Schema } from 'mongoose';
import { MongoDataBase } from '../index.js';

const COLLECTION_NAME = 'Post';

export interface Post extends Document {
  tenderNumber: string;
  tenderName: string;
  tenderStatus: string;
  publicationDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
  link: string;
  
}

const PostSchema = new Schema<Post>(
  {
    tenderNumber: { type: String, required: true, unique: true },
    tenderName: { type: String },
    tenderStatus: { type: String },
    publicationDate: { type: Date },
    applicationStartDate: { type: Date },
    applicationEndDate: { type: Date },
    link: { type: String },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

PostSchema.index({ tenderNumber: 1 });

export const PostModel = MongoDataBase.mainDataBaseConnection.model<Post>(COLLECTION_NAME, PostSchema, COLLECTION_NAME);
