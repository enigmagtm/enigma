import {
  BODY_PARAM, HEADER_PARAMS, METHOD, Parameter, PATH_PARAM, PATH_PARAMS, QueryParameter, QUERY_PARAM, QUERY_PARAMS
} from '../src';
import { HTTPResourceStub } from './http-resource.stub';

const target = HTTPResourceStub.prototype;

describe('http params', () => {
  let headerParamsDef: Parameter[];
  let pathParamsDef: Parameter[];
  let pathParams: Parameter;
  let queryParamsDef: QueryParameter[];
  let queryParams: Parameter;
  let bodyParamDef: Parameter;

  beforeEach(() => {
    headerParamsDef = Reflect.getOwnMetadata(`${METHOD}${HEADER_PARAMS}get`, target) || [];
    pathParamsDef = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAM}getById`, target) || [];
    pathParams = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}getById`, target);
    queryParamsDef = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAM}get`, target) || [];
    queryParams = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}get`, target);
    bodyParamDef = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}create`, target);
  });

  it('should register header params', () => {
    expect(headerParamsDef.length).toBe(1);
    expect(headerParamsDef[0].name).toBe('autorization');
    expect(headerParamsDef[0].index).toBe(1);
  });

  it('should register path params', () => {
    expect(pathParamsDef.length).toBe(1);
    expect(pathParamsDef[0].name).toBe('id');
    expect(pathParamsDef[0].index).toBe(0);
    expect(pathParams.name).toBe('params');
    expect(pathParams.index).toBe(1);
  });

  it('should register query params', () => {
    expect(queryParamsDef.length).toBe(1);
    expect(queryParamsDef[0].name).toBe('value');
    expect(queryParamsDef[0].default).toBeFalsy();
    expect(queryParamsDef[0].index).toBe(0);
    expect(queryParams.name).toBe('query');
    expect(queryParams.index).toBe(2);
  });

  it('should register body params', () => {
    expect(bodyParamDef).toBeTruthy();
    expect(bodyParamDef.name).toBe('create');
    expect(bodyParamDef.index).toBe(0);
  });
});
