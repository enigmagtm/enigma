// eslint-disable-next-line max-classes-per-file
import { BaseRecord, Property } from '../src';
import { TestClass, TestInjectable } from './injectable-test.stub';

describe('injectable', () => {
  let properties: Property[];
  beforeEach(() => {
    properties = Reflect.getOwnMetadata(`INJECT_TestClass`, TestClass.prototype.constructor) || [];
  });

  it('Should have param injected value', () => {
    expect(properties).toBeInstanceOf(Array);
    expect(properties.length).toBeGreaterThan(0);
    expect(properties.length).toBe(1);
  });

  it('Should be instance of TestInjectable', () => {
    expect(new TestClass().propInjectable).toBeInstanceOf(TestInjectable);
  });

  it('should property be of type TestInjectable', () => {
    expect(properties[0].name).toBe('propInjectable');
    expect(properties[0].type.name).toBe(TestInjectable.name);
  });
});

describe('table', () => {
  it('Should be a number type', () => {
    class TestTable implements BaseRecord<number> {
      id!: number;
      constructor() {
        this.id = 1;
      }
    }
    expect(typeof new TestTable().id).toBe('number');
    expect(new TestTable().id).toBe(1);
  });
});
