import { execSync } from 'child_process';
import { join, normalize } from 'path';
import { generateBuild } from './build';
import { buildCompilerOptions } from './compiler-options';
import { updateVersion } from './version';

export const publishPackages = (config: any, ...args: string[]) => {
  console.log('Publish to package manager');
  const path = normalize(config.rootDir)
  for (const dep of config?.dependencies || []) {
    execSync(`cd ${path} && npm i ${dep}@latest`);
  }

  const version = args.find((arg: string) => new RegExp(/(-v=).+\w/g).test(arg)) || '-v=patch';
  args.splice(args.indexOf(version), 1);
  updateVersion(config, version);
  generateBuild(config, ...args);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  execSync(`cd ${join(path, compilerOptions?.outDir || '.')} && npm publish ${args.join(' ')}`);
  execSync(`cd ${path} && git reset --hard HEAD`);
};
