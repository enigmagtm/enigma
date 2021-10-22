import { BaseRecord } from '@enigmagtm/core';
import { Model } from '../model';
import { CountResult, GetAllParams, Transaction } from '../types';
import { DataAccessBase } from './data-access-base';

export interface DataAccess<T extends Model> extends DataAccessBase {
  validate(data: T, $trx: Transaction): Promise<T>;
  onGetAll(rows: T[], $trx: Transaction): Promise<T[]>;
  getAll(params: GetAllParams, $trx: Transaction, useLimit?: boolean): Promise<T[]>;
  getCount(where?: any): Promise<CountResult>;
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
