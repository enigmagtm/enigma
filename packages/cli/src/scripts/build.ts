import { exec } from '../utils';
import { normalize } from 'path';
import { buildCompilerOptions } from './compiler-options';

export const generateBuild = (config: any) => {
  console.log(`Building project/package ${config.name}`.blue);
  const path = normalize(config.rootDir);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  exec(`cd ${path} && rm -rf ${compilerOptions?.outDir || '.'}`);
  exec(`cd ${path} && tsc -p ${config.tsconfig || 'tsconfig.json'}`);
  exec(`cd ${path} && cp {*.md,package.json} ${compilerOptions?.outDir || '.'}`);
  console.log(`Building complete ${config.name}`.green);
};
