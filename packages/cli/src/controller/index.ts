export * from './controller';
export * from './dao';
export * from './model';
export * from './type';

import { sep } from 'path';
import { createFolders } from '../utils';
import { createController, createDataAccessObject, createModel } from './';

export const createControllerResource = async (directory: string, schema: string, table?: string) => {
  try {
    const directories = directory.split(sep);
    const folder = createFolders(directories);
    const model = directories[directories.length - 1];
    createDataAccessObject(folder, model);
    createController(folder, model);
    await createModel(folder, model, schema, table || model);
  } catch (e: any) {
    console.log(`Error in process ${e.message}`);
  }
};