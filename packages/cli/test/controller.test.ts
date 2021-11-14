import fs from 'fs';
import { join, sep } from 'path';
import { createController, createControllerResource, createDataAccessObject, createModel, getType } from '../src/controller';
import { createFolders } from '../src/utils';

describe('controller', () => {
  it('get pg types', () => {
    expect(getType('pg', 'text')).toBe('string');
    expect(getType('pg', 'character varying')).toBe('string');
    expect(getType('pg', 'integer')).toBe('number');
    expect(getType('pg', 'bigint')).toBe('number');
  });
});

describe('controller file', () => {
  let folderPath: string;
  const folder1 = 'test';
  const folder2 = 'create';
  const model = 'folders';
  beforeAll(async () => {
    folderPath = createFolders(join(folder1, folder2, model).split(sep));
    createController(folderPath, model);
    createDataAccessObject(folderPath, model);
    delete process.env.ENIGMA_DB;
    await createModel(folderPath, model, model, model);
  });

  afterAll(() => {
    fs.rmdirSync(join('.', folder1), { recursive: true });
  });

  it('create controller file', () => {
    expect(fs.existsSync(join('.', folder1, folder2))).toBeTruthy();
    expect(fs.existsSync(join('.', folder1, folder2, model))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.controller.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.dao.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.model.ts`))).toBeTruthy();
  });
});


describe('commnad line', () => {
  const folder1 = 'test';
  const folder2 = 'create';
  const model = 'folders';
  const folderPath = join(__dirname, folder1, folder2, model);
  beforeAll(async () => {
    createControllerResource(join(__dirname, folder1, folder2, model), model)
  });

  afterAll(() => {
    fs.rmdirSync(join(__dirname, folder1), { recursive: true });
  });

  it('create controller file', () => {
    expect(fs.existsSync(join(__dirname, folder1, folder2))).toBeTruthy();
    expect(fs.existsSync(join(__dirname, folder1, folder2, model))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.controller.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.dao.ts`))).toBeTruthy();
    expect(fs.existsSync(join(folderPath, `${model}.model.ts`))).toBeTruthy();
  });
});