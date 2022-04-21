import { program } from 'commander';
import { join, normalize } from 'path';
import { loadDeployConfig } from '../scripts/config';
import { updatePackagesDependencies, updatePackagesDependenciesZero } from '../scripts/update-deps';
import { debugLog, exec, log } from '../utils';

interface InstallOptions {
  latest?: boolean;
  clean?: boolean;
}

export const createInstallCommand = (): void => {
  program
    .command('install [projectName]').alias('i')
    .option('-l --latest', 'Install latest versions in project')
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
  process.chdir(normalize(config.rootDir));
  const filename = join(process.cwd(), 'package.json');
  const deps = options.latest ? [] : config.dependencies || [];
  updatePackagesDependencies(config, filename, ...deps);

  if (options.clean) {
    debugLog('Cleaning node_modules'.yellow);
    exec(`rm -rf node_modules`);
  }

  exec(`npm i`);
  updatePackagesDependenciesZero(config, filename, ...(config.dependencies || []));
  log('Dependencies installed.'.green.bold);
};
