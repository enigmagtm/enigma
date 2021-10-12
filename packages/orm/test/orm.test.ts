import { Model } from '../src';
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
