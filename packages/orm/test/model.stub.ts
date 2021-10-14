import { Field, Id, Model, Table } from '../src';

@Table('test', 'schema')
export class ModelStub extends Model {
  @Id()
  id!: number;
  @Field()
  name!: string;
}