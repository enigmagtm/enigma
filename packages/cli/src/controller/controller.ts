import fs from 'fs';
import { capitalize } from 'lodash';
import { join } from 'path';
import { format } from '../utils';

export const createController = (path: string, model: string) => {
  const filename = join(path, `${model}.controller.ts`);
  fs.rmSync(filename, { force: true });
  const file = fs.readFileSync(join(__dirname, '..', 'assets', 'controller.file'), 'utf8');
  fs.writeFileSync(filename, format(file, model, capitalize(model)), { encoding: 'utf8' });
};