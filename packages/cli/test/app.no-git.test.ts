import fs from 'fs';
import { join } from 'path';
import { createApp } from '../src/commands';

describe('app structure with no git', () => {
  const appName = 'test-no-git-app';
  const folderPath = join(process.cwd(), appName);
  beforeAll(() => {
    delete process.env.ENIGMA_RDB;
    fs.rmSync(folderPath, { recursive: true, force: true });
    createApp(appName, { database: 'pg', skipInstall: true, skipGit: true, skipCommit: false, force: false });
  });

  afterAll(() => {
    fs.rmSync(folderPath, { recursive: true });
  });

  it('create folders with no git', () => {
    expect(fs.existsSync(folderPath)).toBeTruthy();
    expect(fs.existsSync(join(folderPath, '.git'))).toBeFalsy();
    expect(fs.existsSync(join(folderPath, 'src'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'src', 'index.ts'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'src', 'app'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'src', 'app', 'app.module.ts'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'src', 'config'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'src', 'config', 'connection.ts'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'package.json'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, 'README.md'))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, '.gitignore'))).toBeTruthy();
  });
});
