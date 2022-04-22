import { program } from 'commander';
import { join, normalize } from 'path';
import { loadPackageJson } from './create/package';

const packageJson = loadPackageJson(normalize(join(__dirname, '../package.json')));
export const main = {
  get version(): string {
    return packageJson.version;
  },
  get verbose(): boolean {
    return program.getOptionValue('verbose');
  }
}