import fs from 'fs';
import { join } from 'path';
import { createFolders, exec } from '../utils';
import { format } from '../utils/format';
import { createPackageJson } from './package';
import { createTsconfigJson } from './tsconfig';

export interface NewAppOptions {
  database: string,
  skipInstall?: boolean;
  skipGit?: boolean;
  skipCommit?: boolean;
}

export const createApp = (name: string, options: NewAppOptions) => {
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
  const entryFile = fs.readFileSync(join(__dirname, '../assets/entry.file'), 'utf8');
  fs.writeFileSync(join(sourcePath, entryFilename), entryFile);
  const appModuleFile = fs.readFileSync(join(__dirname, '../assets/app-module.file'), 'utf8');
  fs.writeFileSync(join(appPath, appFilename), appModuleFile);
  const connectionFile = fs.readFileSync(join(__dirname, '../assets/connection.file'), 'utf8');
  fs.writeFileSync(join(configPath, connectionFilename), connectionFile);
  const readmeFile = fs.readFileSync(join(__dirname, '../assets/readme.file'), 'utf8');
  fs.writeFileSync(join(basePath, readmeFilename), format(readmeFile, name));
  const dotGitignoreFile = fs.readFileSync(join(__dirname, '../assets/gitignore.file'), 'utf8');
  fs.writeFileSync(join(basePath, dotGitignoreFilename), dotGitignoreFile);
  createTsconfigJson(basePath);
  createPackageJson(basePath, options.database);
  if (!options.skipInstall) {
    exec(`cd ${basePath} && npm i`);
  }

  if (!options.skipGit) {
    exec(`cd ${basePath} && git init`);
    if (!options.skipCommit) {
      exec(`cd ${basePath} && git add . && git commit -m ":tada: initial commit`);
    }
  }
};
