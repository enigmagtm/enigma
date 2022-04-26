import { program } from 'commander';
import { buildCompilerOptions, getPackageVersion, loadDeployConfig, updatePackagesDependencies, updatePackageVersion } from '../scripts';
import { exec, log } from '../utils';
import { BuildOptions, generateBuild } from './build';
import { generateVersion, VersionOptions } from './version';

export interface PublishOptions extends BuildOptions, VersionOptions {
  force: boolean;
  dryRun: boolean;
}

export const createPublishCommand = (): void => {
  program
    .command('publish [name]')
    .alias('p')
    .option('-v --version [version]', 'Type of version according to SemVer', 'patch')
    .option('-f --force [force]', 'Force install packages', false)
    .option('-dr --dry-run [dryRun]', 'Publish package to package manager', false)
    .action(publishPackages);
};

const publishPackages = (name: string, options: PublishOptions): void => {
  const config = loadDeployConfig();
  const version = generateVersion(config, options);
  options.version = version;
  const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
  const cwd = process.cwd();
  try {
    for (const project of projects) {
      const configProject = config.projects[project];
      process.chdir(configProject.rootDir);
      publishPackage(configProject, options);
    }
  } finally {
    process.chdir(cwd);
  }
};

export const publishPackage = (config: any, options: PublishOptions) => {
  log(`Publish to package manager ${config.name}`.blue.bold);
  const packageJsonName = 'package.json';
  updatePackagesDependencies(config, packageJsonName, ...(config.dependencies || []));
  exec(`npm i${options.force ? ' -f' : ''}`);
  updatePackageVersion(packageJsonName, getPackageVersion(config.name));
  generateBuild(config, options);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  if (!options.dryRun) {
    log('Publishing to package manager'.magenta);
    exec(`cd ${compilerOptions?.outDir || '.'} && npm publish`);
  }

  exec(`git reset --hard HEAD`);
  log(`Published on package manager ${config.name}`.green.bold);
};
