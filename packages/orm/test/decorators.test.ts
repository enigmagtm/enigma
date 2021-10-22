import { ModelStub } from './model.stub';

describe('decorators', () => {
  it('should assign all table related decorators', () => {
    expect(ModelStub.table).toBe('test');
    expect(ModelStub.schema).toBe('schema');
    expect(ModelStub.primaryKeys).toBeInstanceOf(Array);
    expect(ModelStub.primaryKeys.length).toBe(1);
    expect(ModelStub.primaryKeys[0].name).toBe('id');
    expect(ModelStub.primaryKeys[0].type).toBe('number');
    expect(ModelStub.fields).toBeInstanceOf(Array);
    expect(ModelStub.fields.length).toBe(2);
    expect(ModelStub.fields[0].name).toBe('id');
    expect(ModelStub.fields[0].type).toBe('number');
    expect(ModelStub.fields[0].mapTo).toBeUndefined();
    expect(ModelStub.fields[1].name).toBe('name');
    expect(ModelStub.fields[1].type).toBe('string');
    expect(ModelStub.fields[1].mapTo).toBe('test_name');
    expect(ModelStub.orderBy.length).toBe(1);
    expect(ModelStub.orderBy[0]).toBe('id');
  });
});
