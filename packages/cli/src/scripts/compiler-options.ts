import fs from 'fs';
import { normalize } from 'path';

export const buildCompilerOptions = (tsconfig = 'tsconfig.json'): any => {
  let config: any;
  let compilerOptions: any = {};
  if (!fs.existsSync(normalize(tsconfig))) {
    console.log('Typescript configutration file not found.'.red);
    process.exit();
  }

  const tsconfigData = fs.readFileSync(tsconfig, 'utf8');
  config = JSON.parse(tsconfigData);
  compilerOptions = config?.compilerOptions;
  while (config.extends) {
    const tsconfigExtends = config.extends;
    delete config.extends;
    config = JSON.parse(fs.readFileSync(normalize(tsconfigExtends), 'utf8'));
    compilerOptions = { ...compilerOptions, ...config?.compilerOptions }
  }

  return compilerOptions;
};