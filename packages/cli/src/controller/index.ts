export * from '../utils/type';
export * from './controller';
export * from './dao';
export * from './model';

import fs from 'fs';
import { normalize, sep } from 'path';
import prompt from 'prompt-sync';
import { createFolders, debugLog, log } from '../utils';
import { createController, createDataAccessObject, createModel } from './';

export interface ResourceControllerOptions {
  database: string;
}

export const createResourceController = async (path: string, schema: string, model: string, options: ResourceControllerOptions) => {
  try {
    const folders = normalize(path).split(sep);
    debugLog('Create folers'.yellow);
    const folder = createFolders(folders);
    if (fs.readdirSync(folder).length > 0) {
      const ask = prompt({ sigint: true });
      const yesNo = ask('Directory is not empty, replace existing files? y/n ') || 'n';
      if (yesNo.toLowerCase() !== 'y') {
        log('Process aborted'.red);
        process.exit();
      }
    }

    model = model || folders[folders.length - 1];
    debugLog('Create model');
    await createModel(folder, model, schema, model, options.database);
    debugLog('Create dao');
    createDataAccessObject(folder, model);
    debugLog('Create ctrl');
    createController(folder, model);
  } catch (e: any) {
    log(`Error in process ${e.message}`.red);
  }
};