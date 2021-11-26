import { execSync } from 'child_process';
import { normalize } from 'path';
import { buildCompilerOptions } from './compiler-options';

export const generateBuild = (config: any) => {
  console.log(`Building project/package ${config.name}`.blue);
  const path = normalize(config.rootDir);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  execSync(`cd ${path} && rm -rf ${compilerOptions?.outDir || '.'}`);
  execSync(`cd ${path} && tsc -p ${config.tsconfig || 'tsconfig.json'}`);
  execSync(`cd ${path} && cp {*.md,package.json} ${compilerOptions?.outDir || '.'}`);
  console.log(`Building complete ${config.name}`.green);
};
