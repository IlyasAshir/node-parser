import { UserModel } from '../../db/Users/index.js';

export type TUser = {
  userID: string;
  userName: string;
};
export class UserData {
  public static async saveNewUser(userID: string, userName: string): Promise<TUser> {
    try {
      // Create a new user document
      const newUser = new UserModel({
        userID,
        userName,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      console.log('error while saving user');
      throw error;
    }
  }

  public static getUsers(): Promise<TUser[]> {
    return UserModel.find().exec();
  }
}
