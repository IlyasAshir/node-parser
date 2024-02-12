import { Document, Schema, model } from 'mongoose';
import { MongoDataBase } from '../index.js';

const COLLECTION_NAME = 'User';

export interface User extends Document {
  userID: string;
  userName: string;
}

const UserSchema = new Schema<User>(
  {
    userID: { type: String, required: true, unique: true },
    userName: { type: String },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

UserSchema.index({ userID: 1 });

export const UserModel = MongoDataBase.mainDataBaseConnection.model<User>(COLLECTION_NAME, UserSchema, COLLECTION_NAME);
