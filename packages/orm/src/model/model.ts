import { TypeRef } from '@enigmagtm/core';
import { DataAccessCore } from '../access';
import { FIELDS, ORDER_BY, PRIMARY_KEYS, SCHEMA, TABLE } from '../decorators';
import { FieldInfo } from '../types/field';

export class Model {

  static get table() {
    return Reflect.getOwnMetadata(TABLE, this);
  }

  static get schema(): string {
    return Reflect.getOwnMetadata(SCHEMA, this);
  }

  static get primaryKeys(): FieldInfo[] {
    return Reflect.getOwnMetadata(PRIMARY_KEYS, this);
  }

  static get fields(): FieldInfo[] {
    return Reflect.getOwnMetadata(FIELDS, this);
  }

  static get orderBy(): string[] {
    return Reflect.getOwnMetadata(ORDER_BY, this);
  }

  static oneToMany?: any[];
}

export interface ModelRef<T extends Model> extends TypeRef<T>, DataAccessCore {
}
