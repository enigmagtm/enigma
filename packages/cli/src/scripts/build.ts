import { normalize } from 'path';
import { exec } from '../utils';
import { buildCompilerOptions } from './compiler-options';

export const generateBuild = (config: any) => {
  console.log(`Building project/package ${config.name}`.blue);
  const path = normalize(config.rootDir);
  const compilerOptions = buildCompilerOptions(config.tsconfig, config.rootDir);
  if (compilerOptions.outDir) {
    exec(`cd ${path} && rm -rf ${compilerOptions.outDir}`);
  }

  exec(`cd ${path} && tsc -p ${config.tsconfig || 'tsconfig.json'}`);
  if (compilerOptions.outDir) {
    exec(`cd ${path} && cp {*.md,package.json} ${compilerOptions.outDir}`);
  }

  console.log(`Building complete ${config.name}`.green);
};
