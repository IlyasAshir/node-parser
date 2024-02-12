import { Types } from 'mongoose';
import { Post, PostModel } from '../db/Post/index.js';
import { UserModel, User } from '../db/Users/index.js';

export type PostType = {
  tenderNumber: string;
  tenderName: string;
  tenderStatus: string;
  publicationDate: Date;
  applicationStartDate: Date;
  applicationEndDate: Date;
  link: string;
};

export type FindOnePostOptionsType =
  | {
      tenderNumber: string;
    }
  | {
      _id: Types.ObjectId;
    };

export type FindByStatusType = {
  tenderStatus: string;
};

export type UpdatePostType = {
  tenderName?: string;
};

export class PostData {
  public static async save(data: PostType): Promise<Post> {
    return new PostModel(data).save();
  }

  public static async findOne(findOne: FindOnePostOptionsType): Promise<Post | null> {
    return PostModel.findOne(findOne);
  }

  public static async updateOne(findOne: FindOnePostOptionsType, data: UpdatePostType): Promise<void> {
    await PostModel.updateOne(findOne, data);
  }

  public static async getAllPosts(): Promise<Post[]> {
    return PostModel.find().limit(20);
  }

  public static async findByStatus(status: FindByStatusType): Promise<Post[]> {
    return PostModel.find(status);
  }

  public static async deleteAllPosts(): Promise<void> {
    await PostModel.deleteMany({});
  }

  public static async getExistingPostsID(): Promise<String[]> {
    return PostModel.distinct('tenderNumber');
  }

  public static async getLatestPost(): Promise<any> {
    return PostModel.findOne().sort({ createdAt: -1 });
  }

  public static async checkForNewItems(date: Date): Promise<Post[]> {
    try {
      // Use PostModel.find() to search for items created after the specified date
      const newItems = await PostModel.find({ createdAt: { $gt: date } }).exec();
      console.log(`checkfornewitems: ${newItems}`);
      return newItems;
    } catch (error) {
      // Handle any errors that occur during the database query
      throw new Error(`Error checking for new items`);
    }
    // return PostModel.find({ createdAt: { $gt: date } });
  }
}
export type TUser = {
  userID: string;
  userName: string;
};
export class UserData {
  public static async saveNewUser(userID: string, userName: string): Promise<User> {
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
    }
  }

  public static getUsers(): Promise<User[]> {
    return UserModel.find().exec();
  }
}

// ENUMS //

export enum financialYear {
  _2017 = 2017,
  _2018 = 2018,
  _2019 = 2019,
  _2020 = 2020,
  _2021 = 2021,
  _2022 = 2022,
  _2023 = 2023,
  _2024 = 2024,
}
export enum status {
  COMPLETED = 350,
  CONDITIONAL_DISCOUNT = 270,
  DOCS_CHANGED = 190,
  ON_APPEAL = 440,
  QUALITY_CONTROL_CHECK = 445,
  PUBLISHED = 210,
  PUBLISHED_AND_ADDITION_OF_APPLICATIONS = 230,
  PUBLISHED_AND_ACCEPTING_APPLICATION = 220,
  PUBLISHED_AND_ACCEPTING_PRICE_PROPOSALS = 240,
  PURCHASE_REFUSAL = 410,
  CANCELLED = 430,
  SENT_TO_QUALITY_CONTROL = 450,
  RESULTS_REVIEW = 510,
  DECISION_MAKING_ON_NOTIFICATION_EXECUTION = 540,
  DECISION_MAKING_PPD_REVISION = 530,
  SUSPENDED = 420,
  PASSED_QUALITY_CONTROL = 460,
  REVIEW_APPLICATION_ADDITIONS = 260,
  REVIEW_OF_APPLICATIONS = 250,
  PROTOCOL_FORMATION_OF_AN_ADMISSION = 320,
  PROTOCOL_FORMATION_OF_THE_RESULTS = 330,
  PROTOCOL_FORMATION_OF_A_PREADMISSION = 310,
  PROTOCOL_FORMATION_OF_INTERIM_RESULTS = 320,
}

const obj: { [key: string]: status } = {};

const s = 'Opublasd';
obj[s] = status.CANCELLED;

export enum purchaseMethod {
  REQUST_OF_PRICE_PROPOSALS = 3,
  OPEN_COMPETITION = 2,
  SECOND_STAGE_OF_THE_COMPETITION_USING_FRAMEWORK_AGREEMENT = 133,
  AUCTION_UNTIL_2022 = 7,
  AUCTION_FROM_2022 = 77,
  FROM_ONE_SOURCE_FOR_FAILED_PURCHASES = 6,
  PURCHASING_A_HOME = 50,
  PROCURMENT_UNDER_STATE_SOCIAL_ORDDER = 52,
  COMPETITION_WITH_PRE_QUALIFICATION = 32,
  COMPETITION_USING_TWO_STAGE_PROCEDURES = 22,
  FIRST_STAGE_OF_COMPETITION_SUING_FRAMEWORK_AGREEMENT = 132,
  COMPETITION_FOR_THE_PURCHASE_OF_CATERING_SERVICES_FOR_PUPILS_AND_STUDENTS = 120,
  COMPETITION_FOR_THE_PURCHASE_OF_GOODS_REALTED_TO_PROVIDING_NUTRITIONS_FOR_PUPILS_AND_STUDENTS = 121,
  TENDER = 124,
  TENDER_USING_SPECIAL_PROCEDURE = 190,
  FROM_ONE_SOURCE_FOR_FAILED_PROCUREMENTS_NOT_CIVIL_PROCUREMENT = 125,
  REQUEST_FOR_RPICE_PROPOSALS_NOT_GZ_NEW = 126,
  COMPETITION_USING_A_SPECIAL_PROCEDURE = 128,
  AUCTION_NOT_PUBLIC_PROCUREMENT_UNTIL_2022 = 129,
  AUCTION_NOT_PUBLIC_PROCUREMENT_FROM_2022 = 177,
  COMPETITION_USING_A_RATING_POINT_SYSTEM = 188,
  PUBLIC_PROCUREMENTS_USING_A_SPECIAL_PROCEDURE = 130,
}

export enum purchaseSigns {
  PROCUREMENT_USING_A_SPECIAL_PROCEDURE = 'ref_spec_purchase_type_id',
  PROCUREMENT_OF_THE_SINGLE_ORGANIZER_OF_THE_KGZ_MF_RK = 'singl_org_sign',
  PROCUREMENT_AMONG_ORGANIZATIONS_OF_DISABLED_PEOPLE = 'disable_person_id',
  PROCUREMENT_OF_CONSTRUCTION_AND_INSTALLATION_WORKS_AND_PROCUREMENT_OF_DESIGN = 'is_construction_work',
  ACTIVE_TO_PARTICIPATE = 'is_active',
  INACTIVE_COMPLETED = 'is_not_active',
  CONSTRUCTION_AND_INSTALLATION_WORKS = 'is_construction_cmr',
  DESIGN_WORK = 'is_construction_design',
  PROCUREMENT_OF_SOFTWARE_AND_ELECTRONICS_PRODUCTS = 2,
  PURCHASE_OF_ELECTRICAL_TRANSFORMERS_STATIC_ELECTRICAL_CONVERTERS_RECTIFIERS_INDUCTORS_AND_CHOKES = 7,
  PURCHASE_OF_PASSENGER_CARS_AND_OTHER_MOTOR_VEHICLES = 3,
  PURCHASE_OF_INSULATED_WIRES_INCLUDING_ENAMELED_OR_ANODIZED_CABLES_INCLUDING_COAXIAL_CABLES_AND_OTHER_INSULATED_ELECTRICAL_CONDUCTORS = 8,
  PROCUREMENT_OF_LIGHT_AND_FURNITURE_INDUSTRY = 1,
  PURCHASE_OF_SERVICES_FOR_THE_CREATION_AND_DEVELOPMENT_OF_INFORMATIZATION_OBJECTS = 6,
}

export enum purchaseItem {
  product = 'g',
  service = 's',
  work = 'r',
}

export enum purchaseType {
  firstPurchase = 1,
  secondPurchase = 2,
}
