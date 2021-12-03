import fs from 'fs';
import { join } from 'path';
import { getPackageVersion } from '../scripts';
import { exec } from '../utils';

const createPackages = (...names: string[]): any => {
  const packages: any = {};
  for (const name of names.sort()) {
    packages[name] = getPackageVersion(name);
  }

  return packages;
};

export const createPackageJson = (basePath: string, database: string): void => {
  const filename = 'package.json';
  exec(`cd ${basePath} && npm init --yes`);
  const packageJson: any = JSON.parse(fs.readFileSync(join(basePath, filename), { encoding: 'utf-8' }));
  packageJson.main = 'dist/index.js';
  packageJson.scripts = {
    test: 'echo \"Error: no test specified\" && exit 1',
    dev: 'tsc && nodemon ./dist/index.js 4300',
    start: 'tsc && nodemon ./dist/index.js 4300 production',
    lint: 'eslint src/**/*.ts --fix',
    build: 'tsc'
  };
  packageJson.license = 'UNLICENSED';
  packageJson.dependencies = createPackages(
    '@enigmagtm/core',
    '@enigmagtm/orm',
    '@enigmagtm/http',
    '@enigmagtm/rsc',
    'express',
    'compression',
    'cors',
    'helmet',
    'knex',
    'reflect-metadata',
    database
  );
  packageJson.devDependencies = createPackages(
    '@types/express',
    '@types/compression',
    '@types/cors',
    '@types/node',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint',
    'eslint-plugin-jsdoc',
    'eslint-plugin-prefer-arrow',
    'nodemon',
    'typescript'
  );
  fs.writeFileSync(join(basePath, filename), JSON.stringify(packageJson, null, 2));
};

export const loadPackageJson = (filename: string): any => {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
};
