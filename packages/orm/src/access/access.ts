import { BaseRecord } from '@enigmagtm/core';
import { Model } from '../model';
import { FieldInfo, Transaction } from '../types';

export interface DataAccessCore {
  readonly schema: string;
  readonly table: string;
  readonly fields: FieldInfo[];
  readonly primaryKeys: FieldInfo[];
  readonly orderBy: string[];
  readonly oneToMany?: any[];
}

export interface DataAccessModel<T extends Model> extends DataAccessCore {
  validate(data: T, $trx: Transaction): Promise<T>;
  onGetAll(rows: T[], $trx: Transaction): Promise<T[]>;
  getAll(params: any, $trx: Transaction, useLimit?: boolean): Promise<T[]>;
  getCount(params: any): Promise<any>;
  onGetById(params: any, $trx: Transaction): Promise<T>;
  getById(params: any, $trx: Transaction): Promise<T>;
  insert(params: any, $trx: Transaction): Promise<T>;
  beforeInsert(params: any, $trx: Transaction): Promise<T>;
  afterInsert(params: any, $trx: Transaction): Promise<T>;
  update(params: any, $trx: Transaction): Promise<T>;
  beforeUpdate(oldData: T, newData: T, $trx: Transaction): Promise<T>;
  afterUpdate(params: any, $trx: Transaction): Promise<T>;
  delete(params: any, $trx: Transaction): Promise<T | T[]>;
  beforeDelete(params: any, $trx: Transaction): Promise<T>;
  afterDelete(data: T | T[], $trx: Transaction): Promise<T | T[]>;
  assignCreateLog(data: T, user: BaseRecord<number>): T;
  assignUpdateLog(data: T, user: BaseRecord<number>): T;
}
