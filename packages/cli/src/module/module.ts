import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import prompt from 'prompt-sync';
import { format, log } from '../utils';

export const createModule = (path: string, name: string) => {
  try {
    fs.mkdirSync(path, { recursive: true });
    name = (name || path.split(sep).pop() || '').toLowerCase();
    const filename = join(path, `${name}.module.ts`);
    if (fs.existsSync(filename)) {
      const ask = prompt({ sigint: true });
      const yesNo = ask('File already exists, replace existing file? y/n ') || 'n';
      if (yesNo.toLowerCase() !== 'y') {
        log('Process aborted'.red);
        process.exit();
      }

      fs.rmSync(filename, { force: true });
    }

    const file = fs.readFileSync(join(__dirname, '..', 'assets', 'module.file'), 'utf8');
    fs.writeFileSync(filename, format(file, name, capitalize(name)), { encoding: 'utf8' });
  } catch (e: any) {
    log(`Error in process ${e.message}`);
  }
};
