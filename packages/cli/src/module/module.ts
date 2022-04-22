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

      fs.rmSync(filename, { force: true });
    }

    const dirname = __dirname.split(sep);
    dirname.pop();
    const file = fs.readFileSync(join(...dirname, 'assets', 'module.file'), 'utf8');
    fs.writeFileSync(filename, format(file, name, capitalize(name)), { encoding: 'utf8' });
  } catch (e: any) {
    log(`Error in process ${e.message}`);
  }
};
