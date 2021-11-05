import { enigmaServer } from '../src';
import { ModuleTest, ModuleTest1, ModuleTest2 } from './module-test.stub';

describe('module decorator', () => {
  let testModule: ModuleTest;
  beforeEach(() => {
    testModule = enigmaServer.bootstrap(ModuleTest, { runServer: false });
  });

  it('should create imports', () => {
    expect(testModule.modules).toBeTruthy();
    expect(testModule.modules.length).toBe(2);
    expect(testModule.modules[0]).toBeInstanceOf(ModuleTest1);
    expect(testModule.modules[1]).toBeInstanceOf(ModuleTest2);
  });
});
