import { execSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';

const addPackage = (target: any, name: string): void => {
  target[name] = `^${execSync(`npm show ${name} version`, { encoding: 'utf-8' }).replace('\n', '')}`;
};
const createPackages = (...names: string[]): any => {
  const packages: any = {};
  for (const name of names) {
    addPackage(packages, name);
  }

  return packages;
};

export const createPackageJson = (basePath: string) => {
  const filename = 'package.json';
  execSync(`cd ${basePath} && npm init --yes`);
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
    'reflect-metadata'
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
