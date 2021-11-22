export * from './controller';
export * from './dao';
export * from './model';
export * from '../utils/type';

import fs from 'fs';
import { sep } from 'path';
import prompt from 'prompt-sync';
import { createFolders } from '../utils';
import { createController, createDataAccessObject, createModel } from './';

export const createControllerResource = async (folderPath: string, schema: string, table?: string) => {
  try {
    const folders = folderPath.split(sep);
    const folder = createFolders(folders);
    if (fs.readdirSync(folder).length > 0) {
      const ask = prompt({ sigint: true });
      const yesNo = ask('Directory is not empty, replace existing files? y/n ') || 'n';
      if (yesNo.toLowerCase() !== 'y') {
        console.log('Process aborted');
        process.exit();
      }
    }

    const model = folders[folders.length - 1];
    createDataAccessObject(folder, model);
    createController(folder, model);
    await createModel(folder, model, schema, table || model);
  } catch (e: any) {
    console.log(`Error in process ${e.message}`);
  }
};