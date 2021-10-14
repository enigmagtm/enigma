// eslint-disable-next-line max-classes-per-file
import { Inject, Injectable, INJECT } from '../src/di';
import { BaseRecord } from '../src/types/table';

class TestInjectable {
}

@Injectable()
class TestClass {
  constructor(@Inject(TestInjectable) readonly testInjectable?: TestInjectable) {
  }
}

describe('injectable', () => {
  it('Should have param injected value', () => {
    expect((Reflect.getOwnMetadata(`${INJECT}TestClass`, TestClass.prototype.constructor) || []).length).toBeGreaterThan(0);
  });
  it('Should be instance of TestInjectable', () => {
    expect(new TestClass().testInjectable).toBeInstanceOf(TestInjectable);
  });
});

describe('table', () => {
  it('Should be a number type', () => {
    class TestTable implements BaseRecord<number> {
      id!: number;
      constructor () {
        this.id = 1;
      }
    }
    expect(typeof new TestTable().id).toBe('number');
    expect(new TestTable().id).toBe(1);
  });
});
