import { createRouter } from '../src/types';

describe('types test', () => {
  it('express types', () => {
    expect(createRouter()).toBeTruthy();
  });
})