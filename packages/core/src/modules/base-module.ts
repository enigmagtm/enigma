import { Server } from '../types';

export interface BaseModule {
  new(server: Server): any;
}
