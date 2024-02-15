import { LinkModel } from '../../db/Links/index.js';

export type TLink = {
  url: string;
};

export class LinkData {
  public static async save(data: TLink): Promise<TLink> {
    console.log('save func ', data);
    return new LinkModel(data).save();
  }
  public static async getAllLinks(): Promise<TLink[]> {
    return LinkModel.find();
  }
  public static async deleteAllLinks(): Promise<void> {
    await LinkModel.deleteMany({});
  }
}
