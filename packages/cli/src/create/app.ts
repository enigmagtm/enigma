import fs from 'fs';
import { join, sep } from 'path';
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
  const currentDir = __dirname.split(sep);
  currentDir.pop();
  const entryFile = fs.readFileSync(join(currentDir.join(sep), 'assets', 'entry.file'), 'utf8');
  fs.writeFileSync(join(sourcePath, entryFilename), entryFile);
  const appModuleFile = fs.readFileSync(join(currentDir.join(sep), 'assets', 'app-module.file'), 'utf8');
  fs.writeFileSync(join(appPath, appFilename), appModuleFile);
  const connectionFile = fs.readFileSync(join(currentDir.join(sep), 'assets', 'connection.file'), 'utf8');
  fs.writeFileSync(join(configPath, connectionFilename), connectionFile);
  const readmeFile = fs.readFileSync(join(currentDir.join(sep), 'assets', 'readme.file'), 'utf8');
  fs.writeFileSync(join(basePath, readmeFilename), format(readmeFile, name));
  const dotGitignoreFile = fs.readFileSync(join(currentDir.join(sep), 'assets', 'gitignore.file'), 'utf8');
  fs.writeFileSync(join(basePath, dotGitignoreFilename), dotGitignoreFile);
  createTsconfigJson(basePath);
  createPackageJson(basePath, options.database);
  process.chdir(basePath);
  if (!options.skipInstall) {
    exec(`npm i`);
  }

  if (!options.skipGit) {
    exec(`git init`);
    if (!options.skipCommit) {
      exec(`git add . && git commit -m ":tada: initial commit`);
    }
  }
};
