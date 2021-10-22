import { FieldInfo } from '../types';

export interface DataAccessBase {
  readonly schema: string;
  readonly table: string;
  readonly fields: FieldInfo[];
  readonly primaryKeys: FieldInfo[];
  readonly orderBy: string[];
  readonly oneToMany?: any[];
}
