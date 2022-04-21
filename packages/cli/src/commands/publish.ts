import { program } from 'commander';
import { normalize } from 'path';
import { buildCompilerOptions } from '../scripts/compiler-options';
import { loadDeployConfig } from '../scripts/config';
import { updatePackagesDependencies } from '../scripts/update-deps';
import { exec, log } from '../utils';
import { generateBuild } from './build';
import { generateVersion, VersionOptions } from './version';

export const createPublishCommand = (): void => {
  program
    .command('publish [name]')
    .alias('p')
    .option('-v --version [version]', 'Type of version according to SemVer', 'patch')
    .action((name: string, options: VersionOptions): void => {
      const config = loadDeployConfig();
      const version = generateVersion(config, options);
      options.version = version;
      const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
      for (const project of projects) {
        publishPackage(config.projects[project], options);
      }
    });
};

export const publishPackage = (config: any, options: VersionOptions) => {
  log(`Publish to package manager ${config.name}`.blue.bold);
  process.chdir(normalize(config.rootDir));
  updatePackagesDependencies(config, 'package.json', ...config.dependencies || []);
  exec(`npm i --force`);
  generateBuild(config, options);
  const compilerOptions = buildCompilerOptions(config.tsconfig, config.rootDir);
  exec(`cd ${compilerOptions?.outDir || '.'} && npm publish`);
  exec(`git reset --hard HEAD`);
  log(`Published on package manager ${config.name}`.green.bold);
};
