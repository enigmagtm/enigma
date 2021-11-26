import { execSync } from 'child_process';
import fs from 'fs';
import { join, normalize } from 'path';
import { getPackageVersion } from './pkg-version';

const updateDependencies = (deps: any): void => {
  if (deps) {
    for (const dep of Object.keys(deps)) {
      console.log(`Getting version [${dep}]`.yellow)
      deps[dep] = getPackageVersion(dep);
    }
  }
};

const updatePackagesDependencies = (config: any, filename: string) => {
  console.log(`Update ${filename} dependencies to latest version`.blue);
  const packageJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { dependencies: deps, devDependencies: devDeps, peerDependencies: peerDeps } = packageJson;
  updateDependencies(deps);
  updateDependencies(devDeps);
  updateDependencies(peerDeps);
  fs.writeFileSync(join(config.rootDir, filename), JSON.stringify(packageJson, null, 2));
};

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
    execSync(`rm -rf ${join(path, 'node_modules')}`);
  }

  execSync(`cd ${path} && npm i ${args.join(' ')}`);
};
