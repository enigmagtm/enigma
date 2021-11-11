import { Crypto, crypto } from '../src/utils';
describe('utils test', () => {
  let cryptoTest: Crypto;
  beforeEach(() => {
    cryptoTest = crypto;
  });

  it('should encrypt data', () => {
    expect(cryptoTest.randomBytes()).toBeTruthy();
    expect(cryptoTest.encrypt('testKey', 'passWord')).toBe('Eb4/mCubH2/69KaLvE5DUg==');
    expect(cryptoTest.decrypt('testKey', 'Eb4/mCubH2/69KaLvE5DUg==')).toBe('passWord');
  });
});
