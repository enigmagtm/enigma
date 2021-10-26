// eslint-disable-next-line max-classes-per-file
import { Inject, Injectable } from '../src';

export class TestInjectable {
}

@Injectable()
export class TestClass {
  @Inject() readonly propInjectable: TestInjectable;
}
