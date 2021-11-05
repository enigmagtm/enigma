/* eslint-disable max-classes-per-file */
import { Module, Server } from '../src';

export class ModuleTest1 {
}

export class ModuleTest2 {
}

@Module({
  imports: [
    ModuleTest1,
    ModuleTest2
  ]
})
export class ModuleTest {
  readonly modules: any[];
  constructor(readonly server: Server) { }
}
