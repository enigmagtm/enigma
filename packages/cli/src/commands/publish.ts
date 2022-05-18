import { program } from 'commander';
import { buildCompilerOptions, deployCfg, DeployConfiguration, getPackageVersion, mapProjectDependencies, updatePackagesDependencies, updatePackageVersion } from '../scripts';
import { exec, log, sleep } from '../utils';
import { BuildOptions, generateBuild } from './build';
import { MinifyOptions, uglifyPackage } from './uglify';
import { generateVersion, VersionOptions } from './version';

export interface PublishOptions extends BuildOptions, VersionOptions, MinifyOptions {
  force: boolean;
  dryRun: boolean;
}

export const createPublishCommand = (): void => {
  program
    .command('publish [name]')
    .alias('p')
    .option('-a --assets [assets]', 'Copy assets folder to out directory', 'assets')
    .option('-v --version [version]', 'Type of version according to SemVer', 'patch')
    .option('-f --force [force]', 'Force install packages', false)
    .option('-c --compress [compress]', 'Minify build project/package', true)
    .option('-dr --dry-run [dryRun]', 'Publish package to package manager', false)
    .action(publishPackages);
};

const revert = (version: string) => {
  exec(`git tag -d ${version}`);
  exec(`git reset --hard HEAD~1`);
};

const publishPackages = async (name: string, options: PublishOptions): Promise<void> => {
  const version = generateVersion(deployCfg, options);
  try {
    options.version = version;
    const projects = Object.keys(deployCfg.projects).filter((projectName: any): boolean => !name || projectName === name);
    const cwd = process.cwd();
    try {
      for (const project of projects) {
        const configProject = deployCfg.projects[project];
        process.chdir(configProject.rootDir);
        publishPackage(configProject, options);
        await sleep(5000, `Waiting to publish package ${project}.`);
      }
    } finally {
      if (options.dryRun) revert(options.version);
      process.chdir(cwd);
      exec(`git checkout .`);
    }
  } catch (e: any) {
    log(`Error publishing packages ${e.message}`.red.bold);
    revert(options.version);
  }
};

export const publishPackage = (config: DeployConfiguration, options: PublishOptions) => {
  log(`Publish to package manager ${config.name}`.blue.bold);
  const packageJsonName = 'package.json';
  updatePackagesDependencies(config, packageJsonName, ...mapProjectDependencies(config.dependencies));
  exec(`npm i${options.force ? ' -f' : ''}`);
  updatePackageVersion(packageJsonName, getPackageVersion(config.name));
  generateBuild(config, options);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  log('Publishing to package manager'.magenta);
  if (!options.dryRun) {
    uglifyPackage(config, options);
    exec(`cd ${compilerOptions?.outDir || '.'} && npm publish`);
  }

  log(`Published on package manager ${config.name}`.green.bold);
};
