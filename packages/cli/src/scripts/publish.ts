import { execSync } from 'child_process';
import { cyan } from 'colors';
import { join, normalize } from 'path';
import { generateBuild } from './build';
import { buildCompilerOptions } from './compiler-options';
import { updateVersion } from './version';

export const publishPackages = (config: any, version: string, ...args: string[]) => {
  console.log(`Publish to package manager ${config.name}`, cyan);
  const path = normalize(config.rootDir)
  for (const dep of config?.dependencies || []) {
    execSync(`cd ${path} && npm i ${dep}@latest`);
  }

  updateVersion(config, version);
  generateBuild(config);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  execSync(`cd ${join(path, compilerOptions?.outDir || '.')} && npm publish ${args.join(' ')}`);
  execSync(`cd ${path} && git reset --hard HEAD`);
};
