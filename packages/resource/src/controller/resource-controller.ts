import { Router } from '@enigmagtm/core';
import { HttpVerb, registerMethods, RequestConsumer } from '@enigmagtm/http';
import { routerLog } from '../utils';
import { ControllerBase } from './controller-base';

export abstract class ResourceController implements ControllerBase {
  readonly resource!: string;

  register(router: Router, consumer?: RequestConsumer): Router {
    registerMethods(this, this.resource, HttpVerb.GET, router, consumer);
    registerMethods(this, this.resource, HttpVerb.POST, router, consumer);
    registerMethods(this, this.resource, HttpVerb.PUT, router, consumer);
    registerMethods(this, this.resource, HttpVerb.DELETE, router, consumer);
    registerMethods(this, this.resource, HttpVerb.PATCH, router, consumer);
    routerLog.register(router);
    return router;
  }
}
