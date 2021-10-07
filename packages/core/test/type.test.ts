// eslint-disable-next-line max-classes-per-file
import { Inject, Injectable, INJECT } from '../src/di';

class TestInjectable {
}

@Injectable()
class TestClass {
  constructor(@Inject(TestInjectable) readonly testInjectable?: TestInjectable) {
  }
}

describe('typeref', () => {
  it('Should have param injected value', () => {
    expect((Reflect.getOwnMetadata(`${INJECT}TestClass`, TestClass.prototype.constructor) || []).length).toBeGreaterThan(0);
  });
  it('Should be instance of TestInjectable', () => {
    expect(new TestClass().testInjectable).toBeInstanceOf(TestInjectable);
  });
});
