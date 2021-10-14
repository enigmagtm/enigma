import { compareObj, copyFields, copyObject, validateField } from '../src';
import { ModelStub } from './model.stub';


describe('decorators', () => {
  it('should assign all table related decorators', () => {
    expect(ModelStub.table).toBe('test');
    expect(ModelStub.schema).toBe('schema');
    expect(ModelStub.primaryKeys).toBeInstanceOf(Array);
    expect(ModelStub.primaryKeys[0].name).toBe('id');
    expect(ModelStub.primaryKeys[0].type).toBe('number');
    expect(ModelStub.fields).toBeInstanceOf(Array);
    expect(ModelStub.fields.length).toBe(2);
    expect(ModelStub.fields[0].name).toBe('id');
    expect(ModelStub.fields[0].type).toBe('number');
    expect(ModelStub.fields[1].name).toBe('name');
    expect(ModelStub.fields[1].type).toBe('string');
    expect(ModelStub.orderBy.length).toBe(1);
    expect(ModelStub.orderBy[0]).toBe('id');
  });
});

describe('utils', () => {
  let obj: any;
  let newObj: any;
  let copyObj: any;

  beforeEach(() => {
    obj = { id: 1, name: 'name', desc: 'desc', test: 0 };
    newObj = copyObject(['id', 'name'], obj);
    copyObj = copyObject(['desc'], obj);
  });

  it('should copy fields and create new object', () => {
    expect(newObj.id === 1).toBeTruthy();
    expect(newObj.name === 'name').toBeTruthy();
    expect(newObj.desc === 'desc').toBeFalsy();
    expect(newObj === obj).toBeFalsy();

    expect(copyObj.id === 1).toBeFalsy();
    expect(copyObj.name === 'name').toBeFalsy();
    expect(copyObj.desc === 'desc').toBeTruthy();
    expect(copyObj.test === undefined).toBeTruthy();
  });

  it('should compare objects by fields', () => {
    expect(compareObj(['id', 'name'], obj, newObj)).toBeTruthy();
    expect(compareObj(['id', 'name', 'desc'], obj, newObj)).toBeFalsy();
  });

  it('should validate fields', () => {
    expect(validateField(obj, 'id')).toBeTruthy();
    expect(validateField(obj, 'id', true)).toBeTruthy();
    expect((() => {
      try {
        validateField(newObj, 'desc');
      } catch (e: any) {
        return e.message;
      }
    })()).toBe('The field [desc] is required.');
    expect((() => {
      try {
        validateField(obj, 'test', true);
      } catch (e: any) {
        return e.message;
      }
    })()).toBe(`The field [test] must be greater than 0.`);
  });

  it('should copy fields from source object', () => {
    copyFields(copyObj, [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }], obj);
    expect(copyObj.id === 1).toBeTruthy();
    expect(copyObj.name === 'name').toBeTruthy();
    expect(copyObj.desc === 'desc').toBeTruthy();
    expect(copyObj.test === 0).toBeFalsy();
  })
});
