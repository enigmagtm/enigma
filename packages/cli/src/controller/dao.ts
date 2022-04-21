import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import { format } from '../utils';

export const createDataAccessObject = (path: string, model: string) => {
  const filename = join(path, `${model}.dao.ts`);
  if (fs.existsSync(filename)) {
    fs.rmSync(filename);
  }

  const currentDir = __dirname.split(sep);
  currentDir.pop();
  const file = fs.readFileSync(join(currentDir.join(), 'assets', 'dao.file'), 'utf8');
  fs.writeFileSync(filename, format(file, model, capitalize(model)), { encoding: 'utf8' });
};
