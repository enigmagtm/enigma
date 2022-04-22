import { program } from 'commander';
import fs from 'fs';
import { join, normalize } from 'path';
import { loadDeployConfig, updatePackagesDependencies, updatePackagesDependenciesZero } from '../scripts';
import { debugLog, exec, log } from '../utils';

interface InstallOptions {
  force?: boolean;
  latest?: boolean;
  clean?: boolean;
}

export const createInstallCommand = (): void => {
  program
    .command('install [projectName]').alias('i')
    .option('-f --force', 'Force install of pacakges', false)
    .option('-l --latest', 'Install latest versions of pacakges', false)
    .option('-c --clean', 'Delete node_modules directory', false)
    .action((name: string, options: InstallOptions): void => {
      const config = loadDeployConfig();
      const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
      const cwd = process.cwd();
      try {
        for (const project of projects) {
          const configProject = config.projects[project];
          process.chdir(normalize(join(cwd, configProject.rootDir)));
          installPackages(configProject, options);
        }
      } finally {
        process.chdir(cwd);
      }
    });
};

const installPackages = (config: any, options: InstallOptions) => {
  log(`Install dependencies for ${config.name}`.blue.bold);
  const filename = 'package.json';
  try {
    if (options.latest) {
      updatePackagesDependencies(config, filename);
    }

    if (config.dependencies) {
      updatePackagesDependencies(config, filename, ...config.dependencies);
    }

    if (options.clean) {
      debugLog('Cleaning node_modules'.yellow);
      fs.rmSync('node_modules', { recursive: true, force: true });
    }

    exec(`npm i${options.force ? ' -f' : ''}`);
    log('Dependencies installed.'.green.bold);
  } finally {
    updatePackagesDependenciesZero(config, filename);
  }
};
