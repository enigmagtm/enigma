import { program } from 'commander';
import fs from 'fs';
import { join, normalize } from 'path';
import { buildCompilerOptions } from '../scripts/compiler-options';
import { loadDeployConfig } from '../scripts/config';
import { exec, log } from '../utils';
import { VersionOptions } from './version';

export interface BuildOptions extends VersionOptions {
  assets?: string;
}

export const createBuildCommand = (): void => {
  program
    .command('build [name]').alias('b')
    .option('-a --assets [assets]', 'Copy assets folder to out directory', 'assets')
    .option('-v --version [version]', 'Type of version according to SemVer')
    .action((name: string, options: BuildOptions): void => {
      const config = loadDeployConfig();
      const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
      for (const project of projects) {
        generateBuild(config.projects[project], options);
      }
    });
};

export const generateBuild = (config: any, options: BuildOptions) => {
  log(`Building project/package ${config.name}`.blue.bold);
  const path = normalize(config.rootDir);
  const compilerOptions = buildCompilerOptions(config.tsconfig, config.rootDir);
  if (compilerOptions.outDir) {
    exec(`rm -rf ${join(path, compilerOptions.outDir)}`);
  }

  exec(`tsc -p ${join(path, config.tsconfig || 'tsconfig.json')}`);
  if (compilerOptions.outDir) {
    process.chdir(path);
    if (options.version) {
      exec(`npm version ${options.version}`);
    }

    exec(`cp {*.md,package.json} ${normalize(compilerOptions.outDir)}`);
    if (options.assets) {
      const assets = join(compilerOptions.baseUrl, options.assets);
      if (fs.existsSync(assets)) {
        const assetsDist = join(compilerOptions.outDir, compilerOptions.baseUrl, options.assets);
        exec(`cp -r ${assets} ${assetsDist}`);
      }
    }
  }

  log(`Building complete ${config.name}`.green.bold);
};
