import { join, normalize } from 'path';
import { exec } from '../utils';
import { updatePackagesDependencies, updatePackagesDependenciesZero } from './update-deps';

export const installPackages = (config: any, ...args: string[]) => {
  console.log(`Install package manager dependencies for ${config.name}`.blue);
  const path = normalize(config.rootDir);
  const filename = 'package.json';
  const latest = args.indexOf('--latest');
  if (latest > -1) {
    args.splice(latest, 1);
    updatePackagesDependencies(config, filename);
  }

  const clean = args.indexOf('--clean');
  if (clean > -1) {
    args.splice(clean, 1);
    console.log('Cleaning node_modules'.yellow);
    exec(`rm -rf ${join(path, 'node_modules')}`);
  }

  exec(`cd ${path} && npm i ${args.join(' ')}`);

  if (latest > -1) {
    updatePackagesDependenciesZero(config, filename, ...config.dependencies || []);
  }
};
