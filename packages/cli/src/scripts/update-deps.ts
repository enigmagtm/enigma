import fs from 'fs';
import { join, normalize } from 'path';
import { debugLog, log } from '../utils';
import { DeployConfiguration, loadProjectConfig, mapProjectDependencies } from './config';
import { getPackageVersion } from './pkg-version';

export interface DependencySymlink {
  dependency: string;
  outDir: string;
}

export const updateDependencies = (deps: any, ...include: string[]): void => {
  if (deps) {
    for (const dep of Object.keys(deps)) {
      if (include.length === 0 || include.indexOf(dep) !== -1) {
        debugLog(`Getting version [${dep}]`.yellow);
        deps[dep] = getPackageVersion(dep);
      }
    }
  }
};

export const updateDependenciesSymlink = (deps: any, ...pkgDeps: DependencySymlink[]): void => {
  if (deps) {
    for (const dep of Object.keys(deps)) {
      const dependencySymlink = pkgDeps.find((depSymlink: DependencySymlink) => depSymlink.dependency === dep);
      if (dependencySymlink) {
        debugLog(`Setting dir for symlink on [${dep}] to ${dependencySymlink.outDir}`.yellow);
        deps[dep] = dependencySymlink.outDir;
      }
    }
  }
};

export const updateDependenciesZero = (deps: any, ...pkgDeps: string[]): void => {
  if (deps) {
    for (const dep of Object.keys(deps)) {
      if (pkgDeps.indexOf(dep) !== -1) {
        debugLog(`Setting version [${dep}] to 0.0.0`.yellow);
        deps[dep] = '0.0.0';
      }
    }
  }
};

export const updatePackageVersion = (filename: string, version: string) => {
  log(`Update package.json to version ${version}`.blue.bold);
  const packageJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(filename, JSON.stringify(packageJson, null, 2));
  log(`Updated package.json to ${version}`.green.bold);
};

export const updatePackagesDependencies = (config: DeployConfiguration, filename: string, ...include: string[]) => {
  log(`Update ${config.name} package.json dependencies to latest version`.blue.bold);
  const packageJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { dependencies: deps, devDependencies: devDeps, peerDependencies: peerDeps } = packageJson;
  updateDependencies(deps, ...include);
  updateDependencies(devDeps, ...include);
  updateDependencies(peerDeps, ...include);
  fs.writeFileSync(filename, JSON.stringify(packageJson, null, 2));
  log(`Dependencies updated to latest version on ${config.name} package.json`.green.bold);
};

export const updatePackagesDependenciesSymLink = (config: DeployConfiguration, filename: string) => {
  log(`Update ${config.name} package.json dependencies with symlink`.blue.bold);
  const packageJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { dependencies: deps, devDependencies: devDeps, peerDependencies: peerDeps } = packageJson;
  const depsSymlink = config.dependencies?.map((dep: string) => {
    const projectConfig = loadProjectConfig(dep);
    const tsconfigJson = JSON.parse(fs.readFileSync(projectConfig.tsconfig, 'utf8'));
    return { dependency: projectConfig.name, outDir: normalize(join(projectConfig.rootDir, tsconfigJson.compilerOptions.outDir)) };
  }) || [];
  updateDependenciesSymlink(deps, ...depsSymlink);
  updateDependenciesSymlink(devDeps, ...depsSymlink);
  updateDependenciesSymlink(peerDeps, ...depsSymlink);
  fs.writeFileSync(filename, JSON.stringify(packageJson, null, 2));
  log(`Dependencies updated with symlink on ${config.name} package.json`.green.bold);
};

export const updatePackagesDependenciesZero = (config: DeployConfiguration, filename: string): void => {
  if (!config.dependencies) {
    return log(`No update ${config.name} package.json to version 0.0.0`.yellow);
  }

  log(`Update ${config.name} package.json dependencies to version 0.0.0`.blue);
  const packageJson = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { dependencies: deps, devDependencies: devDeps, peerDependencies: peerDeps } = packageJson;
  const projectDependencies = mapProjectDependencies(config.dependencies);
  updateDependenciesZero(deps, ...projectDependencies);
  updateDependenciesZero(devDeps, ...projectDependencies);
  updateDependenciesZero(peerDeps, ...projectDependencies);
  fs.writeFileSync(filename, JSON.stringify(packageJson, null, 2));
  log(`Dependencies updated to version 0.0.0 on ${config.name} package.json`.green.bold);
};
