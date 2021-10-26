import { RequestHandler, TypeRef } from '@enigmagtm/core';
import { HttpVerb } from '../types';
import { RequestResource } from './request-resource';
import { TypeRule } from './request-rule';

export interface RequestConsumer {
  apply(...requests: RequestHandler[]): RequestResource;
  resolve(controller: unknown, path: string, httpVerb: HttpVerb): RequestHandler[];
}

export class RequestBuilder implements RequestConsumer {
  #requestResources: RequestResource[] = [];
  apply(...requests: RequestHandler[]): RequestResource {
    const requestResource = new RequestResource(...requests);
    this.#requestResources.push(requestResource);
    return requestResource;
  }

  resolve(controller: unknown, path: string, httpVerb: HttpVerb): RequestHandler[] {
    const requests: RequestHandler[] = [];
    for (const request of this.#requestResources) {
      let resolved = true;
      // Add logic for controller
      const ctlrs = request.controllers;
      if (ctlrs) {
        resolved = !!(ctlrs.length === 0 || ctlrs.some((ctrl: TypeRef<unknown>) => controller instanceof ctrl));
      }

      if (resolved && request.rules) {
        for (const rule of request.rules) {
          const regex = RegExp(rule.pathRegex);
          const verbs = rule.httpVerbs;
          const isValid = regex.test(path) && (verbs.length === 0 ||
            verbs.some((verb: HttpVerb) => httpVerb === verb));
          switch (rule.type) {
            case TypeRule.EXCLUDE:
              resolved = !isValid;
              break;
            case TypeRule.INCLUDE:
              resolved = isValid;
              break;
          }

          if (!resolved) break;
        }
      }

      if (resolved) {
        requests.push(...request.requests);
      }
    }

    return requests;
  }
}
