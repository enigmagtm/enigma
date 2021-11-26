import fs from 'fs';
import { join, resolve } from 'path';

export const buildCompilerOptions = (tsconfig = 'tsconfig.json', rootDir = ''): any => {
  let config: any;
  let compilerOptions: any = {};
  const tsconfigFile = join(rootDir, tsconfig);
  if (!fs.existsSync(tsconfigFile)) {
    console.log('Typescript configuration file not found.'.red);
    process.exit();
  }

  const tsconfigData = fs.readFileSync(tsconfigFile, 'utf8');
  config = JSON.parse(tsconfigData);
  compilerOptions = config?.compilerOptions;
  while (config.extends) {
    const tsconfigExtends = config.extends;
    delete config.extends;
    config = JSON.parse(fs.readFileSync(resolve(join(rootDir, tsconfigExtends)), 'utf8'));
    compilerOptions = { ...compilerOptions, ...config?.compilerOptions };
  }

  return compilerOptions;
};