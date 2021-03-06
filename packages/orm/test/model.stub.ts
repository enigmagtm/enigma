import { Field, Id, Model, OrderBy, Table } from '../src';

@Table('test', 'schema')
export class ModelStub extends Model {
  @Id()
  @Field()
  @OrderBy()
  id!: number;
  @Field({ map: 'test_name'})
  name!: string;
}