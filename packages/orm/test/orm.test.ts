import { compareObj, copyFields, copyObject, Model, validateField } from '../src';
import { Field, Id, Table } from '../src/decorators';

@Table('test', 'schema')
class TestModel extends Model {
  @Id()
  id!: number;
  @Field()
  name!: string;
}

describe('decorators', () => {
  it('Should assign all table related decorators', () => {
    expect(TestModel.table).toBe('test');
    expect(TestModel.schema).toBe('schema');
    expect(TestModel.primaryKeys).toBeInstanceOf(Array);
    expect(TestModel.primaryKeys[0].name).toBe('id');
    expect(TestModel.primaryKeys[0].type).toBe('number');
    expect(TestModel.fields).toBeInstanceOf(Array);
    expect(TestModel.fields.length).toBe(2);
    expect(TestModel.fields[0].name).toBe('id');
    expect(TestModel.fields[0].type).toBe('number');
    expect(TestModel.fields[1].name).toBe('name');
    expect(TestModel.fields[1].type).toBe('string');
    expect(TestModel.orderBy.length).toBe(1);
    expect(TestModel.orderBy[0]).toBe('id');
  });
});

describe('utils', () => {
  const obj = { id: 1, name: 'name', desc: 'desc', test: 0 };
  const newObj = copyObject(['id', 'name'], obj);
  const copyObj = copyObject(['desc'], obj);
  it('Should copy fields and create new object', () => {
    expect(newObj.id === 1).toBeTruthy();
    expect(newObj.name === 'name').toBeTruthy();
    expect(newObj.desc === 'desc').toBeFalsy();
    expect(newObj === obj).toBeFalsy();

    expect(copyObj.id === 1).toBeFalsy();
    expect(copyObj.name === 'name').toBeFalsy();
    expect(copyObj.desc === 'desc').toBeTruthy();
    expect(copyObj.test === undefined).toBeTruthy();
  });

  it('Should compare objects by fields', () => {
    expect(compareObj(['id', 'name'], obj, newObj)).toBeTruthy();
    expect(compareObj(['id', 'name', 'desc'], obj, newObj)).toBeFalsy();
  });

  it('Should validate fields', () => {
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

  it('Should copy fields from source object', () => {
    copyFields(copyObj, [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }], obj);
    expect(copyObj.id === 1).toBeTruthy();
    expect(copyObj.name === 'name').toBeTruthy();
    expect(copyObj.desc === 'desc').toBeTruthy();
    expect(copyObj.test === 0).toBeFalsy();
  })
});
