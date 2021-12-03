import { program } from 'commander';
import { loadPackageJson } from './create';

const packageJson = loadPackageJson('package.json');

export const main = {
  get version(): string {
    return packageJson.version;
  },
  get verbose(): boolean {
    return program.getOptionValue('verbose');
  }
}