import { FIELDS, PRIMARY_KEYS, SCHEMA, TABLE } from '../decorators';
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

  static orderBy: string[];
  static oneToMany?: any[];
}
