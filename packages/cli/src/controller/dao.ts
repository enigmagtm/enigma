import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import { format } from '../utils';

export const createDataAccessObject = (path: string, model: string) => {
  const filename = join(path, `${model}.dao.ts`);
  fs.rmSync(filename, { force: true });
  const dirname = __dirname.split(sep);
  dirname.pop();
  const file = fs.readFileSync(join(...dirname, 'assets', 'dao.file'), 'utf8');
  fs.writeFileSync(filename, format(file, model, capitalize(model)), { encoding: 'utf8' });
};
