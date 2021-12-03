import { program } from 'commander';
import { join, normalize } from 'path';
import { debugLog, exec, log } from '../utils';
import { loadDeployConfig } from '../scripts/config';
import { updatePackagesDependencies, updatePackagesDependenciesZero } from '../scripts/update-deps';

interface InstallOptions {
  latest?: boolean;
  clean?: boolean;
}

export const createInstallCommand = (): void => {
  program
    .command('install [projectName]').alias('i')
    .option('-lst --latest', 'Install latest versions in project')
    .option('-c --clean', 'Delete node_modules directory')
    .action((name: string, options: InstallOptions): void => {
      const config = loadDeployConfig();
      const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
      for (const project of projects) {
        installPackages(config.projects[project], options);
      }
    });
};

const installPackages = (config: any, options: InstallOptions) => {
  log(`Install dependencies for ${config.name}`.blue.bold);
  const path = normalize(config.rootDir);
  const filename = 'package.json';
  if (options.latest) {
    updatePackagesDependencies(config, filename);
  }

  if (options.clean) {
    debugLog('Cleaning node_modules'.yellow);
    exec(`rm -rf ${join(path, 'node_modules')}`);
  }

  exec(`cd ${path} && npm i`);
  if (options.latest) {
    updatePackagesDependenciesZero(config, filename, ...config.dependencies || []);
  }

  console.log('Dependencies installed.'.green.bold);
};
