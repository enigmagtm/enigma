import { execSync } from 'child_process';
import fs from 'fs';
import { normalize } from 'path';

const buildCompilerOptions = (tsconfigFile = 'tsconfig.json'): any => {
  let tsconfig: any;
  let compilerOptions: any = {};
  if (!fs.existsSync(normalize(tsconfigFile))) {
    console.log('Typescript configutration file not found');
    process.exit();
  }

  const tsconfigData = fs.readFileSync(tsconfigFile, 'utf8');
  tsconfig = JSON.parse(tsconfigData);
  compilerOptions = tsconfig?.compilerOptions;
  while (tsconfig.extends) {
    const tsconfigExtends = tsconfig.extends;
    delete tsconfig.extends;
    tsconfig = JSON.parse(fs.readFileSync(normalize(tsconfigExtends), 'utf8'));
    compilerOptions = { ...compilerOptions, ...tsconfig?.compilerOptions }
  }

  return compilerOptions;
};

export const generateBuild = (config: any, ..._args: string[]) => {
  console.log('Building project');
  const path = normalize(config.rootDir);
  const compilerOptions = buildCompilerOptions(config.tsconfigFile);
  execSync(`cd ${path} && rm -rf ${compilerOptions?.outDir || 'dist'}`);
  execSync(`cd ${path} && tsc -p ${config.tsconfigFile || 'tsconfig.json'}`);
  execSync(`cd ${path} && cp {*.md,package.json} ${compilerOptions?.outDir || 'dist'}`);
  console.log('Building complete');
};
