export * from './controller';
export * from './dao';
export * from './model';
export * from './type';

import { createFolders } from '../utils';
import { createController, createDAO, createModel } from './';

export const createControllerResource = (directory: string, schema: string, table?: string) => {
  const logError = (e: any) => {
    console.log(`Error in process ${e.message}`);
    process.exit();
  };

  try {
    const directories = directory.split('/');
    const folder = createFolders(directories);
    const model = directories[directories.length - 1];
    createModel(folder, model, schema, table || model)
      .then(() => {
        createDAO(folder, model);
        createController(folder, model);
        console.log('Process finished');
        process.exit();
      }).catch(logError);
  } catch (e) {
    logError(e);
  }
};