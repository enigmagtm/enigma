import {
  BODY_PARAM, HeaderParameter, HEADER_PARAMS, METHOD, Parameter, PathParameter, PATH_PARAMS, QueryParameter,
  QUERY_PARAMS
} from '../src';
import { HTTPResourceStub } from './http-resource.stub';

const target = HTTPResourceStub.prototype;

describe('http params', () => {
  let headerParamsDef: HeaderParameter[];
  let queryParamsDef: QueryParameter[];
  let pathParamsDef: PathParameter[];
  let bodyParamDef: Parameter;

  beforeEach(() => {
    queryParamsDef = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}get`, target) || [];
    headerParamsDef = Reflect.getOwnMetadata(`${METHOD}${HEADER_PARAMS}get`, target) || [];
    pathParamsDef = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}getById`, target) || [];
    bodyParamDef = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}create`, target);
  });

  it('should register query params', () => {
    expect(queryParamsDef.length).toBe(1);
    expect(queryParamsDef[0].name).toBe('value');
    expect(queryParamsDef[0].default).toBeFalsy();
    expect(queryParamsDef[0].index).toBe(0);
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
  });

  it('should register body params', () => {
    expect(bodyParamDef).toBeTruthy();
    expect(bodyParamDef.name).toBe('create');
    expect(bodyParamDef.index).toBe(0);
  });
});
