import { program } from 'commander';
import { join } from 'path';
import { deployCfg } from '../scripts';
import { debugLog, exec, log } from '../utils';

export interface VersionOptions {
  version: string;
}

export const createVersionCommand = () => {
  program
    .command('update-version')
    .alias('uv')
    .option('-v --version [version]', 'Type of version according to SemVer', 'patch')
    .action(generateVersions);
};

const generateVersions = (options: VersionOptions): void => {
  const cwd = process.cwd();
  try {
    const cfg = deployCfg();
    process.chdir(join(cwd, cfg.rootDir));
    const version = generateVersion(cfg, options);
    debugLog(`Update project to version ${version}.`);
  } finally {
    process.chdir(cwd);
  }
};

export const generateVersion = (config: any, options: VersionOptions): string => {
  log(`Update project/package version ${config.name}`.blue.bold);
  const newVersion = exec(`npm version ${options.version}`);
  return newVersion.replace('\n', '');
};
