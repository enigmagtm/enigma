import fs from 'fs';
import { capitalize } from 'lodash';
import { join } from 'path';
import { format } from '../utils';

export const createDataAccessObject = (path: string, model: string) => {
  const filename = join(path, `${model}.dao.ts`);
  fs.rmSync(filename, { force: true });
  const file = fs.readFileSync(join(__dirname, '..', 'assets', 'dao.file'), 'utf8');
  fs.writeFileSync(filename, format(file, model, capitalize(model)), { encoding: 'utf8' });
};
