import { program } from 'commander';
import { normalize } from 'path';
import { loadDeployConfig } from '../scripts/config';
import { debugLog, exec, log } from '../utils';

export interface VersionOptions {
  version: string;
}

export const createVersionCommand = (): void => {
  program
    .command('update-version')
    .alias('uv')
    .option('-v --version [version]', 'Type of version according to SemVer', 'patch')
    .action((options: VersionOptions): void => {
      const version = generateVersion(loadDeployConfig(), options);
      debugLog(`Update project to version ${version}.`);
    });
};

export const generateVersion = (config: any, options: VersionOptions) => {
  log(`Update project/package version ${config.name}`.blue.bold);
  process.chdir(normalize(config.rootDir));
  const newVersion = exec(`npm version ${options.version}`);
  return newVersion.replace('\n', '');
};
