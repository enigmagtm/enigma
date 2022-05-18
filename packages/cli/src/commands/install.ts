import { program } from 'commander';
import fs from 'fs';
import {
  deployCfg, DeployConfiguration, mapProjectDependencies, updatePackagesDependencies, updatePackagesDependenciesSymLink, updatePackagesDependenciesZero
} from '../scripts';
import { debugLog, exec, log } from '../utils';

interface InstallOptions {
  force: boolean;
  latest: boolean;
  clean: boolean;
  symlink: boolean;
}

export const createInstallCommand = (): void => {
  program
    .command('install [projectName]').alias('i')
    .option('-f --force', 'Force install of packages', false)
    .option('-l --latest', 'Install latest versions of packages', false)
    .option('-c --clean', 'Delete node_modules directory', false)
    .option('-sl --symlink', 'Symbolic link to project dependencies', false)
    .action(installPackages);
};

const installPackages = (name: string, options: InstallOptions): void => {
  const cfg = deployCfg();
  const projects = Object.keys(cfg.projects).filter((projectName: any): boolean => !name || projectName === name);
  const cwd = process.cwd();
  try {
    for (const project of projects) {
      const configProject = cfg.projects[project];
      process.chdir(configProject.rootDir);
      installPackage(configProject, options);
    }
  } finally {
    process.chdir(cwd);
    exec('git checkout .');
  }
};

const installPackage = (config: DeployConfiguration, options: InstallOptions) => {
  log(`Install dependencies for ${config.name}`.blue.bold);
  const filename = 'package.json';
  try {
    if (options.latest) {
      debugLog('Updete dependencies to latest'.yellow);
      updatePackagesDependencies(config, filename);
    }

    if (config.dependencies) {
      debugLog('Update project dependencies'.yellow);
      updatePackagesDependencies(config, filename, ...mapProjectDependencies(config.dependencies));
    }

    if (options.clean) {
      debugLog('Cleaning node_modules'.yellow);
      fs.rmSync('node_modules', { recursive: true, force: true });
    }

    if (options.symlink) {
      debugLog('Update dependencies with symlink'.yellow);
      updatePackagesDependenciesSymLink(config, filename);
    }

    exec(`npm i${options.force ? ' -f' : ''}`);

    log('Dependencies installed.'.green.bold);
  } finally {
    updatePackagesDependenciesZero(config, filename);
  }
};
