import fs from 'fs';
import { join, sep } from 'path';
import PromptSync from 'prompt-sync';
import { createFolders, exec, format, log } from '../utils';
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
  const names = name.split(sep);
  const projectPath = createFolders(names);
  if (fs.readdirSync(projectPath).length > 0) {
    const ask = PromptSync({ sigint: true });
    const yesNo = ask('Folder already exists, create app? y/n ') || 'n';
    if (yesNo.toLowerCase() !== 'y') {
      log('Directory is not empty, cannot create app'.red);
      process.exit();
    }

    fs.rmSync(projectPath, { recursive: true, force: true });
  }

  const basePath = createFolders(names);
  const sourcePath = createFolders([...names, source]);
  const appPath = createFolders([...names, source, app]);
  const configPath = createFolders([...names, source, config]);
  const currentDir = __dirname.split(sep);
  const entryFile = fs.readFileSync(join(...currentDir, '..', 'assets', 'entry.file'), 'utf8');
  fs.writeFileSync(join(sourcePath, entryFilename), entryFile);
  const appModuleFile = fs.readFileSync(join(...currentDir, '..', 'assets', 'app-module.file'), 'utf8');
  fs.writeFileSync(join(appPath, appFilename), appModuleFile);
  const connectionFile = fs.readFileSync(join(...currentDir, '..', 'assets', 'connection.file'), 'utf8');
  fs.writeFileSync(join(configPath, connectionFilename), connectionFile);
  const readmeFile = fs.readFileSync(join(...currentDir, '..', 'assets', 'readme.file'), 'utf8');
  fs.writeFileSync(join(basePath, readmeFilename), format(readmeFile, names[names.length - 1]));
  const dotGitignoreFile = fs.readFileSync(join(...currentDir, '..', 'assets', 'gitignore.file'), 'utf8');
  fs.writeFileSync(join(basePath, dotGitignoreFilename), dotGitignoreFile);
  process.chdir(basePath);
  createTsconfigJson();
  createPackageJson(options.database);
  if (!options.skipInstall) {
    exec(`npm i`);
  }

  if (!options.skipGit) {
    exec(`git init`);
    if (!options.skipCommit) {
      exec(`git add . && git commit -m ":tada: initial commit`);
    }
  }
  process.chdir('..');
};
