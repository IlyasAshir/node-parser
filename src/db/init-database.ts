import { MongoDataBase } from './index.js';

export type InitDatabaseOptions = {
  main?: boolean;
  tech?: boolean;
  outputDemping?: boolean;
};

export const initDatabase = async (options: InitDatabaseOptions): Promise<void> => {
  if (options?.main) {
    await MongoDataBase.initMainDataBaseConnection();
  }
};
