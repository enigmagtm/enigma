import fs from 'fs';
import { join, sep } from 'path';
import { createFolders, format, getType } from '../src/utils';

describe('utils', () => {
  let folderPath: string;
  const folder1 = 'test';
  const folder2 = 'create';
  beforeAll(() => {
    folderPath = createFolders(join(folder1, folder2).split(sep));
  });

  afterAll(() => {
    fs.rmSync(join('.', folder1), { recursive: true });
  });

  it('create folders', () => {
    expect(folderPath).toBe(join('.', folder1, folder2));
    expect(fs.existsSync(join('.', folder1))).toBeTruthy();
    expect(fs.existsSync(join('.', folder1, folder2))).toBeTruthy();
  });

  it('get pg types', () => {
    expect(getType('pg', 'text')).toBe('string');
    expect(getType('pg', 'character varying')).toBe('string');
    expect(getType('pg', 'integer')).toBe('number');
    expect(getType('pg', 'bigint')).toBe('number');
  });

  it('format text', () => {
    expect(format('{0}{1}{2}{3}{4}{5}{6}{0}{0}', 'a', 'b', 'c', 'd', 'e', 'f', 'g')).toBe('abcdefgaa');
  });
});
