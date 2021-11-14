import fs from 'fs';
import { join, sep } from 'path';
import { createFolders } from '../src/utils';

describe('utils', () => {
  let folderPath: string;
  const folder1 = 'test';
  const folder2 = 'create';
  beforeAll(() => {
    folderPath = createFolders(join(folder1, folder2).split(sep));
  });

  afterAll(() => {
    fs.rmdirSync(join('.', folder1), { recursive: true });
  });

  it('create folders', () => {
    expect(folderPath).toBe(join('.', folder1, folder2));
    expect(fs.existsSync(join('.', folder1))).toBeTruthy();
    expect(fs.existsSync(join('.', folder1, folder2))).toBeTruthy();
  })
});
