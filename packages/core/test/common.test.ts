import { TestClass } from './injectable-test.stub';

describe('common utils', () => {
  let test: TestClass;
  beforeAll(() => {
    test = new TestClass();
    test.text = 'abcdefghijkl';
  });

  it('should trim string', () => {
    expect(test.text).toBeTruthy();
    expect(test.text.length).toBeLessThanOrEqual(10);
    test.text = 'abcdef';
    expect(test.text.length).toBe(6);
  });
});