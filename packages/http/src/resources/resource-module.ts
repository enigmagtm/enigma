import { Server } from '@enigmagtm/core';
import { RequestConsumer } from './request-consumer';

export interface ResourceModule {
  configure?: (consumer: RequestConsumer) => void;
}

export class HttpResourceModule {
  constructor(protected server: Server) { }
}
