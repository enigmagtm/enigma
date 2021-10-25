import { createRouter, HttpVerb, NextFunction, Request, Response, Router } from '../src/types';
import { buildKeyValue, buildPathParams, registerMethod } from '../src/utils';

describe('utils', () => {
  let fieldsTest1: { name: string; regex?: string; }[];
  let fieldsTest2: { name: string; regex?: string; }[];
  let data: any;
  let router: Router;

  beforeAll(() => {
    data = {
      id: 1,
      name: 'test jest'
    };
    router = createRouter();
  });

  beforeEach(() => {
    fieldsTest1 = [{ name: 'id', regex: '(^[^-](\\d+))' }];
    fieldsTest2 = [{ name: 'id' }, { name: 'name' }];
  });

  it('should build path params', () => {
    expect(new RegExp(fieldsTest1[0].regex || '').test('1235')).toBeTruthy();
    expect(new RegExp(fieldsTest1[0].regex || '').test('-1235')).toBeFalsy();
    expect(buildPathParams(fieldsTest1)).toBe('/:id(^[^-](\\d+))');
    expect(buildPathParams(fieldsTest2)).toBe('/:id/:name');
  });

  it('should build key value messages', () => {
    expect(buildKeyValue(data, fieldsTest1)).toBe('[id]: 1 ');
    expect(buildKeyValue(data, fieldsTest2)).toBe('[id]: 1 [name]: test jest ');
  });

  it('should register methods to router', () => {
    registerMethod(HttpVerb.GET, '', (_req: Request, res: Response, _next: NextFunction) => res.status(200).json(), [], router);
    expect(router.stack.length).toBe(1);
    router.stack.forEach((stack: any) => {
      expect(stack.route.path).toBeFalsy();
      expect(stack.route?.stack[0].method).toBe('get');
    });
  });
});
