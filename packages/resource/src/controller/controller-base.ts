import { Router } from '@enigmagtm/core';
import { RequestConsumer } from '@enigmagtm/http';
import { Model, ModelAccess } from '@enigmagtm/orm';

export interface ControllerBase {
  register(router: Router, consumer?: RequestConsumer): Router;
}

export interface ModelController<T extends Model> extends ControllerBase {
  readonly dao: ModelAccess<T>;
}
