import { Body, Del, Get, Patch, PathParam, Post, Put, QueryParam } from '../src/decorators';
import { BODY_PARAM, HttpStatus, HttpVerb, Method, METHOD, METHODS, Parameter, PathParameter, PATH_PARAMS, QueryParameter, QUERY_PARAMS } from '../src/types';

class TestRESTParams {
  @Get({ status: HttpStatus.PARTIAL_CONTENT })
  get(@QueryParam('value') value: string): string {
    return `all objects with params ${value}`;
  }

  @Get({ path: '/:id(^[^-](\\d+)' })
  getById(@PathParam('id') id: number): string {
    return `one object ${id}`;
  }

  @Post()
  create(@Body() payload: any): string {
    return `created with ${payload}`;
  }

  @Put({ path: '/:id(^[^-](\\d+)' })
  update(@PathParam('id') id: number, @Body() payload: any): string {
    return `updated ${id} with ${payload}`;
  }

  @Patch({ path: '/:id(^[^-](\\d+)' })
  patch(@PathParam('id') id: number, @Body() payload: any): string {
    return `patched ${id} with ${payload}`;
  }

  @Del({ path: '/:id(^[^-](\\d+)' })
  delete(@PathParam('id') id: number): string {
    return `deleted ${id}`;
  }
}

it('should register all types of parameters', () => {
  const headerParamsDef: QueryParameter[] = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}get`, TestRESTParams.prototype) || [];
  expect(headerParamsDef.length).toBe(1);
  expect(headerParamsDef[0].name).toBe('value');
  expect(headerParamsDef[0].default).toBeFalsy();
  expect(headerParamsDef[0].index).toBe(0);


  const pathParamsDef: PathParameter[] = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}getById`, TestRESTParams.prototype) || [];
  expect(pathParamsDef.length).toBe(1);
  expect(pathParamsDef[0].name).toBe('id');
  expect(pathParamsDef[0].index).toBe(0);

  const bodyParamDef: Parameter = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}create`, TestRESTParams.prototype);
  expect(bodyParamDef).toBeTruthy();
  expect(bodyParamDef.name).toBe('create');
  expect(bodyParamDef.index).toBe(0);
});

it('should register all http methods', () => {
  const getMethods: Method[] = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.GET}`, TestRESTParams.prototype) || [];
  expect(getMethods.length).toBe(2);
  expect(getMethods[0].name).toBe('getResource');
  expect(getMethods[1].name).toBe('getByIdResource');
  expect(getMethods[1].path).toBeTruthy();
  expect(getMethods[1].path).toBe('/:id(^[^-](\\d+)');

  const postMethods: Method[] = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.POST}`, TestRESTParams.prototype) || [];
  expect(postMethods.length).toBe(1);
  expect(postMethods[0].name).toBe('createResource');

  const putMethods: Method[] = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.PUT}`, TestRESTParams.prototype) || [];
  expect(putMethods.length).toBe(1);
  expect(putMethods[0].name).toBe('updateResource');
  expect(putMethods[0].path).toBeTruthy();
  expect(putMethods[0].path).toBe('/:id(^[^-](\\d+)');

  const patchMethods: Method[] = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.PATCH}`, TestRESTParams.prototype) || [];
  expect(patchMethods.length).toBe(1);
  expect(patchMethods[0].name).toBe('patchResource');
  expect(patchMethods[0].path).toBeTruthy();
  expect(patchMethods[0].path).toBe('/:id(^[^-](\\d+)');

  const delMethods: Method[] = Reflect.getOwnMetadata(`${METHODS}${HttpVerb.DELETE}`, TestRESTParams.prototype) || [];
  expect(delMethods.length).toBe(1);
  expect(delMethods[0].name).toBe('deleteResource');
  expect(delMethods[0].path).toBeTruthy();
  expect(delMethods[0].path).toBe('/:id(^[^-](\\d+)');
});
