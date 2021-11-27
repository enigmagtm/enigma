import fs from 'fs';
import { join } from 'path';
import { getPackageVersion } from './pkg-version';

export const updateDependencies = (deps: any, ...include: string[]): void => {
  if (deps) {
    for (const dep of Object.keys(deps)) {
      if (include.length === 0 || include.indexOf(dep) !== -1) {
        console.log(`Getting version [${dep}]`.yellow);
        deps[dep] = getPackageVersion(dep);
      }
    }
  }
};

export const updateDependenciesZero = (deps: any, pkgDeps: string[], ...include: string[]): void => {
  if (deps) {
    for (const dep of Object.keys(deps)) {
      if (include.length === 0 || include.indexOf(dep) !== -1) {
        if (pkgDeps.indexOf(dep) !== -1) {
          console.log(`Setting version [${dep}] to 0`.yellow);
          deps[dep] = '0.0.0';
        }
      }
    }
  }
};

export const updatePackagesDependencies = (config: any, filename: string, ...include: string[]) => {
  console.log(`Update ${filename} dependencies to latest version`.blue);
  const packageJsonFile = join(config.rootDir, filename);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
  const { dependencies: deps, devDependencies: devDeps, peerDependencies: peerDeps } = packageJson;
  updateDependencies(deps, ...include);
  updateDependencies(devDeps, ...include);
  updateDependencies(peerDeps, ...include);
  fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2));
};

export const updatePackagesDependenciesZero = (config: any, filename: string, ...include: string[]) => {
  console.log(`Update ${filename} dependencies to latest version`.blue);
  const packageJsonFile = join(config.rootDir, filename);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
  const { dependencies: deps, devDependencies: devDeps, peerDependencies: peerDeps } = packageJson;
  updateDependenciesZero(deps, config.dependencies || [], ...include);
  updateDependenciesZero(devDeps, config.dependencies || [], ...include);
  updateDependenciesZero(peerDeps, config.dependencies || [], ...include);
  fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2));
};
