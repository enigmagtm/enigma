import { Router } from '@enigmagtm/core';
import {
  buildKeyValue, buildPathParams, createResourceMethod, Credentials, HttpError, HttpStatus, HttpVerb, registerMethod, RequestConsumer,
  ResourceParameters
} from '@enigmagtm/http';
import { copyFields, FindResult, Model, ModelAccess, Transaction } from '@enigmagtm/orm';
import { isNil } from 'lodash';
import { createTransactionalMethod } from '../utils';
import { ResourceController } from './resource-controller';

export class ModelResourceController<T extends Model> extends ResourceController {
  readonly dao!: ModelAccess<T>;
  private registerFindMethod(router: Router, consumer?: RequestConsumer): void {
    const name = this.find.name;
    const options = { name, path: `/${this.resource}` };
    const resolvers = consumer?.resolve(this, options.path, HttpVerb.GET) || [];
    const params: ResourceParameters = {
      headerParamsDef: [{ name: 'credentials', index: 0 }],
      queryParamsDef: [{ name: 'where', index: 1, default: {} }]
    };
    const httpMethod = createTransactionalMethod(HttpStatus.PARTIAL_CONTENT);
    const resourceMethod = createResourceMethod(this, httpMethod, this.find, options, params);
    registerMethod(HttpVerb.GET, options.path, resourceMethod, resolvers, router);
  }

  private registerFindByIdMethod(router: Router, consumer?: RequestConsumer): void {
    const name = this.findById.name;
    const options = { name, path: `/${this.resource}${buildPathParams(this.dao.primaryKeys)}` };
    const resolvers = consumer?.resolve(this, options.path, HttpVerb.GET) || [];
    const params: ResourceParameters = {
      pathParams: { name: 'params', index: 0 },
      headerParamsDef: [
        { name: 'credentials', index: 1 }
      ]
    };
    const httpMethod = createTransactionalMethod(HttpStatus.OK);
    const resourceMethod = createResourceMethod(this, httpMethod, this.findById, options, params);
    registerMethod(HttpVerb.GET, options.path, resourceMethod, resolvers, router);
  }

  private registerCreateMethod(router: Router, consumer?: RequestConsumer): void {
    const name = this.insert.name;
    const options = { name, path: `/${this.resource}` };
    const resolvers = consumer?.resolve(this, options.path, HttpVerb.POST) || [];
    const params: ResourceParameters = {
      headerParamsDef: [{ name: 'credentials', index: 0 }],
      bodyParamDef: { name: 'data', index: 1 }
    };
    const httpMethod = createTransactionalMethod(HttpStatus.OK);
    const resourceMethod = createResourceMethod(this, httpMethod, this.insert, options, params);
    registerMethod(HttpVerb.POST, options.path, resourceMethod, resolvers, router);
  }

  private registerUpdateMethod(router: Router, consumer?: RequestConsumer): void {
    const name = this.update.name;
    const options = { name, path: `/${this.resource}${buildPathParams(this.dao.primaryKeys)}` };
    const resolvers = consumer?.resolve(this, options.path, HttpVerb.PUT) || [];
    const params: ResourceParameters = {
      pathParams: { name: 'params', index: 0 },
      headerParamsDef: [
        { name: 'credentials', index: 1 }
      ],
      bodyParamDef: { name: 'data', index: 2 }
    };
    const httpMethod = createTransactionalMethod(HttpStatus.OK);
    const resourceMethod = createResourceMethod(this, httpMethod, this.update, options, params);
    registerMethod(HttpVerb.PUT, options.path, resourceMethod, resolvers, router);
  }

  private registerPatchMethod(router: Router, consumer?: RequestConsumer): void {
    const name = this.patch.name;
    const options = { name, path: `/${this.resource}${buildPathParams(this.dao.primaryKeys)}` };
    const resolvers = consumer?.resolve(this, options.path, HttpVerb.PATCH) || [];
    const params: ResourceParameters = {
      pathParams: { name: 'params', index: 0 },
      headerParamsDef: [
        { name: 'credentials', index: 1 }
      ],
      bodyParamDef: { name: 'data', index: 2 }
    };
    const httpMethod = createTransactionalMethod(HttpStatus.OK);
    const resourceMethod = createResourceMethod(this, httpMethod, this.patch, options, params);
    registerMethod(HttpVerb.PATCH, options.path, resourceMethod, resolvers, router);
  }

  private registerDeleteMethod(router: Router, consumer?: RequestConsumer): void {
    const name = this.update.name;
    const options = { name, path: `/${this.resource}${buildPathParams(this.dao.primaryKeys)}` };
    const resolvers = consumer?.resolve(this, options.path, HttpVerb.DELETE) || [];
    const params: ResourceParameters = {
      pathParams: { name: 'params', index: 0 },
      headerParamsDef: [
        { name: 'credentials', index: 1 }]
    };
    const httpMethod = createTransactionalMethod(HttpStatus.OK);
    const resourceMethod = createResourceMethod(this, httpMethod, this.update, options, params);
    registerMethod(HttpVerb.DELETE, options.path, resourceMethod, resolvers, router);
  }

  async find(credentials: Credentials, where: any, trxn: Transaction): Promise<FindResult<T>> {
    const params = { where, ...credentials };
    const data = await Promise.all([this.dao.getAll(params, trxn), this.dao.getCount(where)]);
    return {
      data: data[0],
      rows: data[1].rows as number
    };
  }

  async findById(params: any, credentials: Credentials, trxn: Transaction): Promise<T> {
    const data = await this.dao.getById({ ...params, ...credentials }, trxn);
    if (isNil(data)) {
      throw new HttpError(HttpStatus.NOT_FOUND, `Record ${buildKeyValue(params, this.dao.primaryKeys)} not found in ${this.dao.table}`);
    }
    return data;
  }

  async insert(credentials: Credentials, data: T, trxn: Transaction): Promise<T> {
    return await this.dao.insert({ data, ...credentials }, trxn);
  }

  async update(params: any, credentials: Credentials, data: T, trxn: Transaction): Promise<T> {
    data = copyFields(data, this.dao.primaryKeys, params);
    const newData = await this.dao.update({ data, ...credentials }, trxn);
    params.rowsAffected = 1;
    return newData;
  }

  async patch(params: any, credentials: Credentials, data: T, trxn: Transaction): Promise<T> {
    data = copyFields(data, this.dao.primaryKeys, params);
    const newData = await this.dao.patch({ data, ...credentials }, trxn);
    params.rowsAffected = 1;
    return newData;
  }

  async delete(params: any, credentials: Credentials, trxn: Transaction): Promise<T | T[]> {
    return await this.dao.delete({ ...params, ...credentials }, trxn);
  }

  register(router: Router, consumer?: RequestConsumer): Router {
    this.registerFindMethod(router, consumer);
    this.registerFindByIdMethod(router, consumer);
    this.registerCreateMethod(router, consumer);
    this.registerUpdateMethod(router, consumer);
    this.registerPatchMethod(router, consumer);
    this.registerDeleteMethod(router, consumer);
    router = super.register(router, consumer);
    return router;
  }
}





/*

import { NextFunction, Request, Response, Router } from '@enigmagtm/core';
import { buildKeyValue, buildPathParams, HttpError, HttpStatus, HttpVerb, registerMethod, RequestConsumer } from '@enigmagtm/http';
import { copyFields, Model, ModelRef, transaction } from '@enigmagtm/orm';
import { isNil } from 'lodash';
import { ProcessAccess } from '../controller';
import { AccessControl, EntityAccess } from './access-crud';
import { ResourceController } from './controller';

export class CRUDController<T extends Model> extends ResourceController<T> {
  readonly accessCtrl: AccessControl = {
    async access(_user: any, resource: string): Promise<EntityAccess> {
      return { read: true, create: true, update: true, delete: true, name: resource };
    },
    async accessProcess(_user: any, _processId: number): Promise<ProcessAccess> {
      return { execute: true, name: 'unknown' };
    }
  }
  constructor(reference: ModelRef<T>) {
    super(reference);
  }

  private async readAccess(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.accessCtrl.access((req as any).info.user, this.resource);
      if (!data.read) { // Validate read access per user
        throw new HttpError(HttpStatus.FORBIDDEN, `You don't have access to read ${data.name}`);
      }
      next();
    } catch (e: any) {
      next(e);
    }
  }

  private async createAccess(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.accessCtrl.access((req as any).info.user, this.resource);
      if (!data.create) { // Validate create access per user
        throw new HttpError(HttpStatus.FORBIDDEN, `You don't have access to create ${data.name}`);
      }
      next();
    } catch (e: any) {
      next(e);
    }
  }

  private async updateAccess(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.accessCtrl.access((req as any).info.user, this.resource);
      if (!data.update) { // Validate update access per user
        throw new HttpError(HttpStatus.FORBIDDEN, `You don't have access to update ${data.name}`);
      }
      next();
    } catch (e: any) {
      next(e);
    }
  }

  private async deleteAccess(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.accessCtrl.access((req as any).info.user, this.resource);
      if (!data.delete) { // Validate delete access per user
        throw new HttpError(HttpStatus.FORBIDDEN, `You don't have access to delete ${data.name}`);
      }
      next();
    } catch (e: any) {
      next(e);
    }
  }

  private registerFindMethod(router: Router, consumer?: RequestConsumer): void {
    const path = `/${this.resource}`;
    const resolvers = consumer?.resolve(this, path, HttpVerb.GET) || [];
    resolvers?.unshift(this.readAccess.bind(this));
    registerMethod(HttpVerb.GET, path, this.find.bind(this), resolvers, router);
  }

  private registerFindByIdMethod(router: Router, consumer?: RequestConsumer): void {
    const path = `/${this.resource}${buildPathParams(this.modelRef.primaryKeys)}`;
    const resolvers = consumer?.resolve(this, path, HttpVerb.GET) || [];
    resolvers?.unshift(this.readAccess.bind(this));
    registerMethod(HttpVerb.GET, path, this.findById.bind(this), resolvers, router);
  }

  private registerCreateMethod(router: Router, consumer?: RequestConsumer): void {
    const path = `/${this.resource}`;
    const resolvers = consumer?.resolve(this, path, HttpVerb.POST) || [];
    resolvers?.unshift(this.createAccess.bind(this));
    registerMethod(HttpVerb.POST, path, this.insert.bind(this), resolvers, router);
  }

  private registerUpdateMethod(router: Router, consumer?: RequestConsumer): void {
    const path = `/${this.resource}${buildPathParams(this.modelRef.primaryKeys)}`;
    const resolvers = consumer?.resolve(this, path, HttpVerb.PUT) || [];
    resolvers?.unshift(this.updateAccess.bind(this));
    registerMethod(HttpVerb.PUT, path, this.update.bind(this), resolvers, router);
  }

  private registerPatchMethod(router: Router, consumer?: RequestConsumer): void {
    const path = `/${this.resource}${buildPathParams(this.modelRef.primaryKeys)}`;
    const resolvers = consumer?.resolve(this, path, HttpVerb.PATCH) || [];
    resolvers?.unshift(this.updateAccess.bind(this));
    registerMethod(HttpVerb.PATCH, path, this.patch.bind(this), resolvers, router);
  }

  private registerDeleteMethod(router: Router, consumer?: RequestConsumer): void {
    const path = `/${this.resource}${buildPathParams(this.modelRef.primaryKeys)}`;
    const resolvers = consumer?.resolve(this, path, HttpVerb.DELETE) || [];
    resolvers?.unshift(this.deleteAccess.bind(this));
    registerMethod(HttpVerb.DELETE, path, this.delete.bind(this), resolvers, router);
  }

  register(router: Router, consumer?: RequestConsumer): Router {
    this.registerFindMethod(router, consumer);
    this.registerFindByIdMethod(router, consumer);
    this.registerCreateMethod(router, consumer);
    this.registerUpdateMethod(router, consumer);
    this.registerPatchMethod(router, consumer);
    this.registerDeleteMethod(router, consumer);
    router = super.register(router, consumer);
    return router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = { ...req.query, ...{ info: (req as any).info } } as any;
    const trxn = await transaction();
    try {
      const data = await Promise.all([this.dao.getAll(params, trxn), this.dao.getCount(params.where)]);
      res.status(HttpStatus.PARTIAL_CONTENT).json({
        data: data[0],
        rows: data[1].rows
      });
      trxn.commit();
    } catch (e) {
      trxn.rollback(e);
      next(e);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = copyFields({
      ...req.query,
      ...(req as any).info
    }, this.dao.primaryKeys, req.params);
    const trxn = await transaction();
    try {
      const data = await this.dao.getById(params, trxn);
      if (isNil(data)) {
        throw new HttpError(HttpStatus.NOT_FOUND, `Record ${buildKeyValue(req.params, this.dao.primaryKeys)} not found in ${this.dao.table}`);
      }
      trxn.commit();
      res.status(HttpStatus.OK).json(data);
    } catch (e) {
      trxn.rollback(e);
      next(e);
    }
  }

  async insert(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = {
      data: req.body,
      ...(req as any).info
    };
    const trxn = await transaction();
    try {
      const newItem = await this.dao.insert(params, trxn);
      trxn.commit();
      res.status(HttpStatus.CREATED).json(newItem);
    } catch (e) {
      trxn.rollback(e);
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = copyFields({
      data: req.body,
      ...(req as any).info
    }, this.dao.primaryKeys, req.params);
    const trxn = await transaction();
    try {
      params.data = copyFields(params.data, this.dao.primaryKeys, req.body);
      const newData = await this.dao.update(params, trxn);
      params.rowsAffected = 1;
      trxn.commit();
      res.status(HttpStatus.OK).json(newData);
    } catch (e) {
      trxn.rollback(e);
      next(e);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = copyFields({
      data: req.body,
      ...(req as any).info
    }, this.dao.primaryKeys, req.params);
    const trxn = await transaction();
    try {
      params.data = copyFields(params.data, this.dao.primaryKeys, req.body);
      const newData = await this.dao.patch(params, trxn);
      trxn.commit();
      res.status(HttpStatus.OK).json(newData);
    } catch (e) {
      trxn.rollback(e);
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const params = copyFields({
      ...req.query,
      ...(req as any).info
    }, this.dao.primaryKeys, req.params);
    const trxn = await transaction();
    try {
      const deleted = await this.dao.delete(params, trxn);
      trxn.commit();
      res.status(HttpStatus.OK).json(deleted);
    } catch (e) {
      trxn.rollback(e);
      next(e);
    }
  }
}
 */