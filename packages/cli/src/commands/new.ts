import { program } from 'commander';
import fs from 'fs';
import { join } from 'path';
import PromptSync from 'prompt-sync';
import { exec, format, log } from '../utils';
import { createPackageJson } from './package';
import { createTsconfigJson } from './tsconfig';

export interface NewAppOptions {
  database: string,
  skipInstall: boolean;
  skipGit: boolean;
  skipCommit: boolean;
  force: boolean;
}

export const createNewCommand = (): void => {
  program
    .command('new <name>')
    .requiredOption('-db --database <database>')
    .option('-f --force', 'Force install of packages', false)
    .option('-skipi --skip-install', 'Skip installation of packages', false)
    .option('-skipg --skip-git', 'Skip git initialization', false)
    .option('-skipc --skip-commit', 'Skip initial commit', false)
    .action(createApp);
};

export const createApp = (name: string, options: NewAppOptions) => {
  const source = 'src';
  const app = 'app';
  const config = 'config';
  const entryFilename = 'index.ts';
  const appFilename = 'app.module.ts';
  const connectionFilename = 'connection.ts';
  const readmeFilename = 'README.md';
  const dotGitignoreFilename = '.gitignore';
  const folderPath = join(process.cwd(), name);
  fs.mkdirSync(folderPath, { recursive: true });
  if (fs.readdirSync(folderPath).length > 0) {
    const ask = PromptSync({ sigint: true });
    const yesNo = ask('Folder already exists, create app? y/n ') || 'n';
    if (yesNo.toLowerCase() !== 'y') {
      log('Directory is not empty, cannot create app'.red);
      process.exit();
    }

    fs.rmSync(folderPath, { recursive: true, force: true });
  }

  const sourcePath = join(folderPath, source);
  fs.mkdirSync(sourcePath, { recursive: true });
  const appPath = join(sourcePath, app);
  fs.mkdirSync(appPath, { recursive: true });
  const configPath = join(sourcePath, config);
  fs.mkdirSync(configPath, { recursive: true });
  const entryFile = fs.readFileSync(join(__dirname, '..', 'assets', 'entry.file'), 'utf8');
  fs.writeFileSync(join(sourcePath, entryFilename), entryFile);
  const appModuleFile = fs.readFileSync(join(__dirname, '..', 'assets', 'app-module.file'), 'utf8');
  fs.writeFileSync(join(appPath, appFilename), appModuleFile);
  const connectionFile = fs.readFileSync(join(__dirname, '..', 'assets', 'connection.file'), 'utf8');
  fs.writeFileSync(join(configPath, connectionFilename), connectionFile);
  const readmeFile = fs.readFileSync(join(__dirname, '..', 'assets', 'readme.file'), 'utf8');
  fs.writeFileSync(join(folderPath, readmeFilename), format(readmeFile, name));
  const dotGitignoreFile = fs.readFileSync(join(__dirname, '..', 'assets', 'gitignore.file'), 'utf8');
  fs.writeFileSync(join(folderPath, dotGitignoreFilename), dotGitignoreFile);
  process.chdir(folderPath);
  createTsconfigJson();
  createPackageJson(options.database);
  if (!options.skipInstall) {
    exec(`npm i${options.force ? ' -f' : ''}`);
  }

  if (!options.skipGit) {
    exec(`git init`);
    if (!options.skipCommit) {
      exec(`git add . && git commit -m ":tada: initial commit"`);
    }
  }
  process.chdir('..');
};
