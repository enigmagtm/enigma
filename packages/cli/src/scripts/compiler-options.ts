import fs from 'fs';
import { log } from '../utils';

export const buildCompilerOptions = (tsconfig = 'tsconfig.json'): any => {
  let config: any;
  let compilerOptions: any = {};
  const tsconfigFile = tsconfig;
  if (!fs.existsSync(tsconfigFile)) {
    log('Typescript configuration file not found.'.red);
    process.exit();
  }

  const tsconfigData = fs.readFileSync(tsconfigFile, 'utf8');
  config = JSON.parse(tsconfigData);
  compilerOptions = config?.compilerOptions;
  while (config.extends) {
    const tsconfigExtends = config.extends;
    delete config.extends;
    config = JSON.parse(fs.readFileSync(tsconfigExtends, 'utf8'));
    compilerOptions = { ...compilerOptions, ...config?.compilerOptions };
  }

  return compilerOptions;
};