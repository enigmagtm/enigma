import { connection } from '../db';
import { Model, ModelRef } from '../model';
import { Connection, FieldInfo } from '../types';
import { DataAccessBase } from './data-access-base';

export class ModelAccessBase<T extends Model> implements DataAccessBase {
  readonly schema: string;
  readonly table: string;
  readonly fields: FieldInfo[];
  readonly primaryKeys: FieldInfo[];
  readonly orderBy: string[];
  readonly oneToMany: any[];
  constructor(options: ModelRef<T>) {
    const { schema, table, fields, primaryKeys, orderBy, oneToMany = [] } = options;
    this.schema = schema;
    this.table = table;
    this.fields = fields;
    this.primaryKeys = primaryKeys;
    this.orderBy = orderBy;
    this.oneToMany = oneToMany;
  }

  get db(): Connection {
    return connection(this.schema);
  }
}
