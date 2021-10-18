import { BaseRecord } from '@enigmagtm/core';
import { isNil, remove } from 'lodash';
import { connection, DataAccess } from '.';
import { Model, ModelRef } from '../model';
import { Connection, CountResult, FieldInfo, GetAllParams, Transaction } from '../types';
import { compareObj, copyFields, copyObject, parseWhere } from '../utils';

export class DataModelAccess<T extends Model> implements DataAccess<T> {
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

  async validate(data: T, _$trx?: Transaction): Promise<T> {
    return data;
  }

  async onGetAll(rows: T[], _$trx?: Transaction): Promise<T[]> {
    return rows;
  }

  async onGetById(params: any, _$trx?: Transaction): Promise<T> {
    return params;
  }

  async beforeInsert(data: T, $trx: Transaction): Promise<T> {
    return await this.validate(data, $trx);
  }

  async afterInsert(data: T, _$trx?: Transaction): Promise<T> {
    return data;
  }

  async beforeUpdate(_oldData: T, newData: T, $trx: Transaction): Promise<T> {
    return await this.validate(newData, $trx);
  }

  async afterUpdate(data: T, _$trx?: Transaction): Promise<T> {
    return data;
  }

  async beforePatch(_oldData: T, newData: T, $trx: Transaction): Promise<T> {
    return await this.validate(newData, $trx);
  }

  async afterPatch(data: T, _$trx?: Transaction): Promise<T> {
    return data;
  }

  async beforeDelete(data: T, _$trx?: Transaction): Promise<T> {
    return data;
  }

  async afterDelete(data: T | T[], _$trx?: Transaction): Promise<T | T[]> {
    return data;
  }

  assignCreateLog(data: T, user?: BaseRecord<number>): T {
    const instance = (data as any);
    instance.userCreateId = user?.id;
    instance.createdAt = new Date().getTime();
    return data;
  }

  assignUpdateLog(data: T, user?: BaseRecord<number>): T {
    const instance = (data as any);
    instance.userUpdateId = user?.id;
    instance.updatedAt = new Date().getTime();
    return data;
  }

  async getAll(params: GetAllParams, $trx: Transaction): Promise<T[]> {
    const { sfields = this.fields.map((key: FieldInfo) => key.name),
      offset = 0,
      limit = 10,
      useLimit = true,
      where } = params;
    let query = this.db
      .select(sfields)
      .from<T>(this.table)
      .orderBy(this.orderBy)
      .transacting($trx);
    if (where) {
      query = parseWhere(query, where);
    }

    let rows: T[];
    if (useLimit) {
      query = query.offset(offset).limit(limit);
    }

    rows = (await query as T[]);
    rows = (await this.onGetAll(rows, $trx) as T[]);
    return rows;
  }

  async getCount(where?: any): Promise<CountResult> {
    let query = this.db
      .count({ rows: 1 })
      .from<T>(this.table);
    if (where) {
      query = parseWhere(query, where);
    }
    return (await query)[0];
  }

  async getById(params: any, $trx: Transaction): Promise<T> {
    const { sfields = this.fields.map((key: FieldInfo) => key.name) } = params;
    if (this.primaryKeys.reduce((valid: boolean, field: FieldInfo) => valid || isNil(params[field.name]), false)) {
      throw new Error(`Primary keys not found ${this.primaryKeys.map((key: FieldInfo) => key.name).join(',')}`);
    }

    const where = copyFields({}, this.primaryKeys, params);
    const query = this.db
      .select(sfields)
      .from(this.table)
      .where(where)
      .transacting($trx);

    const list = await query;
    const data = list[0];

    if (!isNil(data) && !isNil(this.oneToMany)) {
      for (const det of this.oneToMany) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const $details = require(`./${det.model}`);
        const parameters = det.foreignKeys.reduce((master: any, key: any) => {
          master[key.local] = data[key.reference];
          return master;
        }, {});
        const details = await $details.getAll({
          offset: 0,
          limit: 100,
          where: parameters
        }, $trx, false);
        data[det.detail] = details;
      }
    }

    return await this.onGetById(data, $trx);
  }

  async insert(params: any, $trx: Transaction): Promise<T> {
    const { data, user } = params;
    try {
      await this.beforeInsert(data, $trx);
      this.assignCreateLog(data, user);
      const obj = copyObject(this.fields.map((key: FieldInfo) => key.name), data);
      if (this.primaryKeys.length === 1) {
        delete obj[this.primaryKeys[0].name];
      }

      const query = this.db
        .insert(obj)
        .table(this.table)
        .returning(this.fields.map((key: FieldInfo) => key.name))
        .transacting($trx);
      let newObj = (await query)[0] as T;

      for (const det of this.oneToMany || []) {
        const details = [];
        if (!isNil(data[det.detail]) && data[det.detail].length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const $details = require(`./${det.model}`);
          for (let detail of data[det.detail]) {
            (det.foreignKeys || []).forEach((/* fk: any */) => {
              // detail[fk.local] = newObj[fk.reference];
            });
            detail = copyObject($details.fields, detail);
            details.push(detail);
          }

          /* const chunkSize = details.length;
          newObj[det.detail] = (await $trx.batchInsert(`${det.schema}.${det.table}`, details, chunkSize)
            .transacting($trx) as any); */
        }
      }

      newObj = await this.afterInsert(newObj, $trx);
      return await this.getById(copyFields({}, this.primaryKeys, newObj), $trx);
    } catch (e) {
      throw e;
    }
  }

  async update(params: any, $trx: Transaction): Promise<T> {
    try {
      const { data, user } = params;
      const oldData = await this.getById(data, $trx);
      let newData = copyObject(this.fields.map((key: FieldInfo) => key.name), data);
      const where = copyFields({}, this.primaryKeys, data);
      const query = this.db
        .update(newData)
        .table(this.table)
        .where(where)
        .returning(this.fields.map((key: FieldInfo) => key.name))
        .transacting($trx);
      newData = await this.beforeUpdate(oldData, newData, $trx);
      this.assignUpdateLog(newData, user);
      newData = await query;
      newData = newData[0];

      for (const detOneToMany of (this.oneToMany || [])) {
        if (!isNil(data[detOneToMany.detail]) && data[detOneToMany.detail].length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const $details = require(`./${detOneToMany.model}`);
          const oldDetail = (oldData as any)[detOneToMany.detail];
          const newDetail = (data[detOneToMany.detail] || []);
          const details = [];
          const detailsToInsert = remove(newDetail, (newDet: any) => {
            return isNil(newDet.id);
          });

          if (detailsToInsert.length > 0) {
            for (let detail of detailsToInsert) {
              (detOneToMany.foreignKeys || []).forEach((fk: any) => {
                detail[fk.local] = newData[fk.reference];
              });
              detail = copyObject($details.fields, detail);
              details.push(detail);
            }

            const chunkSize = detailsToInsert.length;
            await $trx.batchInsert(`${detOneToMany.schema}.${detOneToMany.table}`, details, chunkSize)
              .returning('*')
              .transacting($trx);
          }

          const detailsToDelete = [];
          const detailsToUpdate = [];

          let flgDelete = 1;
          for (const oldDet of oldDetail) {
            for (const newDet of newDetail) {
              if (oldDet.id === newDet.id) {
                if (!compareObj($details, oldDet, newDet)) {
                  detailsToUpdate.push(newDet);
                } else {
                  details.push(oldDet);
                }

                flgDelete = 0
                break;
              }
            }

            if (flgDelete === 1) {
              detailsToDelete.push(oldDet);
            }

            flgDelete = 1;
          }

          for (let det of detailsToDelete) {
            det = copyObject($details.fields, det);
            // TODO needs to be validated
            const wherefk = copyFields({}, detOneToMany.foreignKeys, det);
            const queryDelete = connection(detOneToMany.schema)
              .del()
              .table(detOneToMany.table)
              .where(wherefk)
              .transacting($trx);
            await queryDelete;
          }

          for (let det of detailsToUpdate) {
            det = copyObject($details.fields, det);
            const wherefk = copyFields({}, detOneToMany.foreignKeys, det);
            const queryUpdate = connection(detOneToMany.schema)
              .table(detOneToMany.table)
              .where(wherefk)
              .returning($details.fields)
              .transacting($trx);

            const newDet = await queryUpdate.update(det);
            details.push(newDet);
          }

          newData[detOneToMany.detail] = details;
        }
      }
      newData = await this.afterUpdate(newData, $trx);

      return newData;
    } catch (e) {
      throw e;
    }
  }

  async patch(params: any, $trx: Transaction): Promise<T> {
    try {
      const { data, user } = params;
      const oldData = await this.getById(data, $trx);
      delete data.userCreateId;
      delete data.createdAt;
      delete data.userUpdateId;
      delete data.updatedAt;
      let patchData = {
        ...copyObject(this.fields.map((key: FieldInfo) => key.name), oldData),
        ...copyObject(this.fields.map((key: FieldInfo) => key.name), data)
      };
      const where = copyFields({}, this.primaryKeys, data);
      const query = this.db
        .update(patchData)
        .table(this.table)
        .where(where)
        .returning(this.fields.map((key: FieldInfo) => key.name))
        .transacting($trx);
      patchData = await this.beforePatch(oldData, patchData, $trx);
      this.assignUpdateLog(patchData, user);
      patchData = await query;
      patchData = patchData[0];
      const patchedData = await this.update({ data: patchData, user }, $trx) as T;
      patchData = await this.afterPatch(patchedData, $trx);
      return patchData;
    } catch (e) {
      throw e;
    }
  }

  async delete(params: any, $trx: Transaction): Promise<T | T[]> {
    try {
      const { where = {} } = params;
      const details = [];
      for (const det of (this.oneToMany || [])) {
        const queryfk = connection(det.schema)
          .table(det.table)
          .where((det.foreignKeys || []).reduce((wherefk: any, fk: any) => {
            wherefk[fk.local] = params[fk.reference];
            return wherefk;
          }, {}))
          .transacting($trx);
        details.push(queryfk);
      }

      copyFields(where, this.primaryKeys, params);
      const query = this.db
        .table<T>(this.table)
        .where(where)
        .returning(this.fields.map((key: FieldInfo) => key.name))
        .transacting($trx);

      await this.beforeDelete(params, $trx);
      for (const detail of details) {
        await detail.del();
      }
      const item = (await query.del<T | T[]>() as T | T[]) as T;
      await this.afterDelete(item, $trx);
      return item;
    } catch (e) {
      throw e;
    }
  }
}
