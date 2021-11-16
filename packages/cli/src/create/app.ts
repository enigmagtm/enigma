import { execSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { createFolders } from '../utils';
import { appModuleFile, connectionFile, dotGitignoreFile, entryFile, readmeFile } from '../utils/files';
import { format } from '../utils/format';
import { createPackageJson } from './package';
import { createTsconfigJson } from './tsconfig';

export const createApp = (name: string, ...options: string[]) => {
  const source = 'src';
  const app = 'app';
  const config = 'config';
  const entryFilename = 'index.ts';
  const appFilename = 'app.module.ts';
  const connectionFilename = 'connection.ts';
  const readmeFilename = 'README.md';
  const dotGitignoreFilename = '.gitignore';
  const projectPath = createFolders([name]);
  if (fs.readdirSync(projectPath).length > 0) {
    console.log('Directory is not empty, cannot create app');
    process.exit();
  }

  const basePath = createFolders([name]);
  const sourcePath = createFolders([name, source]);
  const appPath = createFolders([name, source, app]);
  const configPath = createFolders([name, source, config]);
  fs.writeFileSync(join(sourcePath, entryFilename), entryFile);
  fs.writeFileSync(join(appPath, appFilename), appModuleFile);
  fs.writeFileSync(join(configPath, connectionFilename), connectionFile);
  fs.writeFileSync(join(basePath, readmeFilename), format(readmeFile, name));
  fs.writeFileSync(join(basePath, dotGitignoreFilename), dotGitignoreFile);
  createTsconfigJson(basePath);
  createPackageJson(basePath);
  if (options.indexOf('--skip-npm') === -1) {
    execSync(`cd ${basePath} && npm i`);
  }

  if (options.indexOf('--skip-git') === -1) {
    execSync(`cd ${basePath} && git init`);
    if (options.indexOf('--skip-commit') === -1) {
      execSync(`cd ${basePath} && git add . && git commit -m ":tada: initial commit`);
    }
  }
};
