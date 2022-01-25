import fs from 'fs';
import { join } from 'path';
import { createModule } from '../src/module';

describe('command line', () => {
  const folder1 = 'test';
  const folder2 = 'create';
  const module = 'folders';
  const folderPath = join(__dirname, folder1, folder2, module);
  beforeAll(async () => {
    createModule(join(__dirname, folder1, folder2, module), module);
  });

  afterAll(() => {
    fs.rmSync(join(__dirname, folder1), { recursive: true });
  });

  it('create module file', () => {
    expect(fs.existsSync(join(__dirname, folder1, folder2))).toBeTruthy();
    expect(fs.existsSync(join(__dirname, folder1, folder2, module))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${module}.module.ts`))).toBeTruthy();
  });
});
