import { program } from 'commander';
import fs from 'fs';
import { join, normalize } from 'path';
import { buildCompilerOptions, getPackageVersion, loadDeployConfig, updatePackagesDependencies, updatePackagesDependenciesZero, updatePackageVersion } from '../scripts';
import { exec, log } from '../utils';
import { VersionOptions } from './version';

export interface BuildOptions extends VersionOptions {
  assets: string;
}

export const createBuildCommand = (): void => {
  program
    .command('build [name]').alias('b')
    .option('-a --assets [assets]', 'Copy assets folder to out directory', 'assets')
    .option('-v --version [version]', 'Type of version according to SemVer')
    .action((name: string, options: BuildOptions): void => {
      const config = loadDeployConfig();
      const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
      const cwd = process.cwd();
      try {
        for (const project of projects) {
          const configProject = config.projects[project];
          process.chdir(normalize(join(cwd, configProject.rootDir)));
          generateBuild(configProject, options);
        }
      } finally {
        process.chdir(cwd);
      }
    });
};

export const generateBuild = (config: any, options: BuildOptions) => {
  log(`Building project/package ${config.name}`.blue.bold);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  if (compilerOptions.outDir) {
    fs.rmSync(compilerOptions.outDir, { recursive: true, force: true });
  }

  exec(`tsc -p ${config.tsconfig || 'tsconfig.json'}`);
  if (compilerOptions.outDir) {
    const packageJsonName = 'package.json';
    updatePackageVersion(packageJsonName, getPackageVersion(config.name));
    updatePackagesDependencies(config, packageJsonName);
    const outDir = normalize(compilerOptions.outDir);
    if (options.version) {
      exec(`cd ${outDir} && npm version ${options.version}`);
    }

    exec(`cp {*.md,package.json} ${outDir}`);
    updatePackageVersion('package.json', '0.0.0');
    updatePackagesDependenciesZero(config, packageJsonName);
    const baseUrl = normalize(compilerOptions.baseUrl);
    const assets = join(baseUrl, options.assets);
    if (fs.existsSync(assets)) {
      const assetsDist = join(outDir, baseUrl, options.assets);
      fs.cpSync(assets, assetsDist, { recursive: true });
    }
  }

  log(`Building complete ${config.name}`.green.bold);
};
