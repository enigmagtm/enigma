import { createRouter, RequestHandler, Server, TypeRef } from '@enigmagtm/core';
import { RequestBuilder } from './request-consumer';

export interface ResourceController {
  path: string;
  controller: TypeRef<any>;
}

export interface ResourceParams {
  path: string;
  requests?: RequestHandler[];
  resources: ResourceController[];
}

export const ResourceOptions = (options: ResourceParams): ClassDecorator => {
  const ResourceOptionsDecorator = <TFunction extends Function>(target: TFunction): TFunction => {
    const original = target as any;

    const construct: any = function (server: Server) {
      const instance = new original(server);
      let consumer;
      if (instance.configure) {
        consumer = new RequestBuilder();
        instance.configure(consumer);
      }

      for (const resourceRef of options.resources) {
        const ctrl = new resourceRef.controller();
        ctrl.resource = resourceRef.path;
        const router = createRouter();
        for (const request of (options.requests || [])) {
          router.use(request);
        }

        ctrl.register(router, consumer);
        server.use(options.path, router);
      }

      return instance;
    }

    construct.prototype = original.prototype;
    return construct;
  };
  return ResourceOptionsDecorator;
}
