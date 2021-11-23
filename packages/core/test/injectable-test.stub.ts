// eslint-disable-next-line max-classes-per-file
import { Inject, Injectable, MaxLength } from '../src';

export class TestInjectable {
}

@Injectable()
export class TestClass {
  @Inject() readonly propInjectable: TestInjectable;
  @MaxLength(10) text: string;
}
