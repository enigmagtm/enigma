export * from '../utils/type';
export * from './controller';
export * from './dao';
export * from './model';

import fs from 'fs';
import { sep } from 'path';
import prompt from 'prompt-sync';
import { debugLog, log } from '../utils';
import { createController, createDataAccessObject, createModel } from './';

export interface ResourceControllerOptions {
  database: string;
}

export const createResourceController = async (path: string, schema: string, model: string, options: ResourceControllerOptions) => {
  try {
    debugLog('Create folers'.yellow);
    fs.mkdirSync(path, { recursive: true });
    if (fs.readdirSync(path).length > 0) {
      const ask = prompt({ sigint: true });
      const yesNo = ask('Directory is not empty, replace existing files? y/n ') || 'n';
      if (yesNo.toLowerCase() !== 'y') {
        log('Process aborted'.red);
        process.exit();
      }
    }

    model = model || path.split(sep).pop() || '';
    debugLog('Create model');
    await createModel(path, model, schema, model, options.database);
    debugLog('Create dao');
    createDataAccessObject(path, model);
    debugLog('Create ctrl');
    createController(path, model);
  } catch (e: any) {
    log(`Error in process ${e.message}`.red);
  }
};