import fs from 'fs';
import { join, sep } from 'path';
import { createController, createDataAccessObject, createModel, createResourceController } from '../src/controller';
import { createFolders } from '../src/utils';

describe('controller file', () => {
  let folderPath: string;
  const folder1 = 'test';
  const folder2 = 'create';
  const model = 'folders';
  const cwd = process.cwd();
  beforeAll(async () => {
    folderPath = createFolders(join(cwd, folder1, folder2, model).split(sep));
    delete process.env.ENIGMA_DB;
    createController(folderPath, model);
    createDataAccessObject(folderPath, model);
    await createModel(folderPath, model, model, model);
  });

  afterAll(() => {
    fs.rmSync(join(cwd, folder1), { recursive: true });
  });

  it('create controller file', () => {
    expect(fs.existsSync(join(cwd, folder1, folder2))).toBeTruthy();
    expect(fs.existsSync(join(cwd, folder1, folder2, model))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.controller.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.dao.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.model.ts`))).toBeTruthy();
  });
});

describe('command line', () => {
  const folder1 = 'test';
  const folder2 = 'create';
  const model = 'folders';
  const cwd = process.cwd();
  const folderPath = join(cwd, folder1, folder2, model);
  beforeAll(() => {
    delete process.env.ENIGMA_DB;
    createResourceController(folderPath, model, model, { database: 'pg' });
  });

  afterAll(() => {
    fs.rmSync(join(cwd, folder1), { recursive: true });
  });

  it('create controller file 2', () => {
    expect(fs.existsSync(join(cwd, folder1))).toBeTruthy();
    expect(fs.existsSync(join(cwd, folder1, folder2))).toBeTruthy();
    expect(fs.existsSync(folderPath)).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.controller.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.dao.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.model.ts`))).toBeTruthy();
  });
});
