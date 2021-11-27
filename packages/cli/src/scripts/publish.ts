import { join, normalize } from 'path';
import { exec } from '../utils';
import { generateBuild } from './build';
import { buildCompilerOptions } from './compiler-options';
import { updatePackagesDependencies } from './update-deps';
import { updateVersion } from './version';

export const publishPackage = (config: any, version: string, ...args: string[]) => {
  console.log(`Publish to package manager ${config.name}`.blue);
  const path = normalize(config.rootDir);
  updatePackagesDependencies(config, 'package.json', ...config.dependencies || []);
  exec(`cd ${path} && npm i --force && rm -rf package-lock.json`);
  updateVersion(config, version);
  generateBuild(config);
  const compilerOptions = buildCompilerOptions(config.tsconfig, config.rootDir);
  exec(`cd ${join(path, compilerOptions?.outDir || '.')} && npm publish ${args.join(' ')}`);
  exec(`cd ${path} && git reset --hard HEAD`);
};
