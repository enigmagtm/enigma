import { execSync } from 'child_process';
import { normalize } from 'path';
import { buildCompilerOptions } from './compiler-options';

export const generateBuild = (config: any, ..._args: string[]) => {
  console.log('Building project');
  const path = normalize(config.rootDir);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  execSync(`cd ${path} && rm -rf ${compilerOptions?.outDir || '.'}`);
  execSync(`cd ${path} && tsc -p ${config.tsconfig || 'tsconfig.json'}`);
  execSync(`cd ${path} && cp {*.md,package.json} ${compilerOptions?.outDir || '.'}`);
  console.log('Building complete');
};
