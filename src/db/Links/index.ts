import { Document, Schema } from 'mongoose';
import { MongoDataBase } from '../index.js';

const COLLECTION_NAME = 'Links';

export interface Link extends Document {
  url: string;
}

const LinksSchema = new Schema<Link>(
  {
    url: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

LinksSchema.index({ link: 1 });

export const LinkModel = MongoDataBase.mainDataBaseConnection.model<Link>(
  COLLECTION_NAME,
  LinksSchema,
  COLLECTION_NAME,
);
