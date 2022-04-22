import fs from 'fs';
import { join } from 'path';
import { createModule } from '../src/module';

describe('command line', () => {
  const folder1 = 'test';
  const folder2 = 'create';
  const module = 'folders';
  const cwd = process.cwd();
  const folderPath = join(cwd, folder1, folder2, module);
  beforeAll(() => {
    createModule(folderPath, module);
  });

  afterAll(() => {
    fs.rmSync(join(cwd, folder1), { recursive: true });
  });

  it('create module file', () => {
    expect(fs.existsSync(join(cwd, folder1))).toBeTruthy();
    expect(fs.existsSync(join(cwd, folder1, folder2))).toBeTruthy();
    expect(fs.existsSync(folderPath)).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${module}.module.ts`))).toBeTruthy();
  });
});
