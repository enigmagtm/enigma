import { RequestHandler, TypeRef } from '@enigmagtm/core';
import { RequestRule } from './request-rule';

export class RequestResource {
  requests!: RequestHandler[];
  controllers?: TypeRef<any>[];
  rules?: RequestRule[];

  constructor(...requests: RequestHandler[]) {
    this.requests = requests;
  }

  forControllers(...controllers: TypeRef<any>[]): RequestResource {
    this.controllers = controllers;
    return this;
  }

  addRule(...rules: RequestRule[]): void {
    this.rules = rules;
  }
}
