import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import { format } from '../utils';

export const createController = (path: string, model: string) => {
  const filename = join(path, `${model}.controller.ts`);
  if (fs.existsSync(filename)) {
    fs.rmSync(filename);
  }


  const currentDir = __dirname.split(sep);
  currentDir.pop();
  const file = fs.readFileSync(join(currentDir.join(), 'assets', 'controller.file'), 'utf8');
  fs.writeFileSync(filename, format(file, model, capitalize(model)), { encoding: 'utf8' });
};