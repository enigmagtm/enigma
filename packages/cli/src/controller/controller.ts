import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import { format } from '../utils';

export const createController = (path: string, model: string) => {
  const filename = join(path, `${model}.controller.ts`);
  fs.rmSync(filename, { force: true });
  const dirname = __dirname.split(sep);
  dirname.pop();
  const file = fs.readFileSync(join(...dirname, 'assets', 'controller.file'), 'utf8');
  fs.writeFileSync(filename, format(file, model, capitalize(model)), { encoding: 'utf8' });
};