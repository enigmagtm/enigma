import { FieldInfo } from '@enigmagtm/orm';
import { createRouter, HttpVerb, NextFunction, Request, Response, Router } from '../src/types';
import { buildKeyValue, buildPathParams, registerMethod } from '../src/utils';

const fieldsTest1: FieldInfo[] = [{ name: 'id', type: 'number', regex: '(^[^-](\\d+))' }];
const fieldsTest2: FieldInfo[] = [{ name: 'id', type: 'number' }, { name: 'name', type: 'string' }];
const data = {
  id: 1,
  name: 'test jest'
};

it('Check utils buildPathParams', () => {
  expect(new RegExp(fieldsTest1[0].regex || '').test('1235')).toBeTruthy();
  expect(new RegExp(fieldsTest1[0].regex || '').test('-1235')).toBeFalsy();
  expect(buildPathParams(fieldsTest1)).toBe('/:id(^[^-](\\d+))');
  expect(buildPathParams(fieldsTest2)).toBe('/:id/:name');
});

it('Check utils buildKeyValue', () => {
  expect(buildKeyValue(data, fieldsTest1)).toBe('[id]: 1 ');
  expect(buildKeyValue(data, fieldsTest2)).toBe('[id]: 1 [name]: test jest ');
});

it('should register methods to router', () => {
  expect(1).toBeTruthy();
  const router: Router = createRouter();
  registerMethod(HttpVerb.GET, '', (_req: Request, res: Response, _next: NextFunction) => res.status(200).json(), [], router);
  expect(router.stack.length).toBe(1);
  router.stack.forEach((stack: any) => {
    expect(stack.route.path).toBeFalsy();
    expect(stack.route?.stack[0].method).toBe('get');
  });
});
