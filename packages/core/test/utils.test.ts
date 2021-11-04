import { Crypto, crypto } from '../src/utils';
describe('utils test', () => {
  let cryptoTest: Crypto;
  beforeEach(() => {
    cryptoTest = crypto;
  });

  it('should encrypt data', () => {
    expect(cryptoTest.randomBytes()).toBeTruthy();
    expect(cryptoTest.encrypt('testKey', 'passWord')).toBe('jcs7s4mHFcOHgVKPxKA/eA==');
  });
});
