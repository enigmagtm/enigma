import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import prompt from 'prompt-sync';
import { createFolders, format, log } from '../utils';

export const createModule = (path: string, name: string) => {
  try {
    const folders = path.split(sep);
    const folder = createFolders(folders);
    name = (name || folders[folders.length - 1]).toLowerCase();
    const filename = join(folder, `${name}.module.ts`);
    if (fs.existsSync(filename)) {
      const ask = prompt({ sigint: true });
      const yesNo = ask('File already exists, replace existing file? y/n ') || 'n';
      if (yesNo.toLowerCase() !== 'y') {
        log('Process aborted'.red);
        process.exit();
      }

      fs.rmSync(filename);
    }

    const currentDir = __filename.split(sep);
    currentDir[currentDir.length - 2] = 'assets';
    currentDir[currentDir.length - 1] = 'module.file';
    const file = fs.readFileSync(join(currentDir.join(sep)), 'utf8');
    fs.writeFileSync(filename, format(file, name, capitalize(name)), { encoding: 'utf8' });
  } catch (e: any) {
    log(`Error in process ${e.message}`);
  }
};
