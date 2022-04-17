import fs from 'fs';
import { join } from 'path';
import { createApp } from '../src/create';

describe('app structure with no git', () => {
  const appName = 'test-no-git-app';
  const folderPath = join('.', appName);
  beforeAll(() => {
    delete process.env.ENIGMA_DB;
    createApp(appName, { database: 'pg', skipInstall: true, skipGit: true });
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
