import {
  BODY_PARAM, CustomHttpMethod, HEADER_PARAMS, HttpParams, HttpStatus, HttpVerb, METHOD, Parameter, PATH_PARAMS, QueryParameter,
  QUERY_PARAMS, RESOURCE_METHOD
} from '../types';
import { HttpMethodDecorator } from './http-method.decorator';
import { createResourceMethod } from './resource-method';

let customMethod: CustomHttpMethod = async (target: Object, method: any, args: any[], params: HttpParams): Promise<void> => {
  try {
    const result = await method.apply(target, args);
    (params.res as any).res.status(params.options?.status || HttpStatus.OK).json(result);
  } catch (e) {
    params.next(e);
  }
};

const httpStrategyMethod: CustomHttpMethod = async (target: Object, method: any, args: any[], params: HttpParams): Promise<void> => {
  return customMethod(target, method, args, params);
};

export const configureDeleteMethod = (method: CustomHttpMethod) => {
  customMethod = method;
};

export const Del = (options?: any): MethodDecorator => {
  const DeleteDecorator = (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<any>):
    TypedPropertyDescriptor<any> | void => {
    const method = descriptor.value;
    if (method) {
      const name = `${String(property)}${RESOURCE_METHOD}`;
      options = { ...{ name }, ...options };
      HttpMethodDecorator(target, name, HttpVerb.DELETE, options);
      const headerParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${HEADER_PARAMS}${String(property)}`, target) || [];
      const pathParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}${String(property)}`, target) || [];
      const queryParamsDef: QueryParameter[] = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}${String(property)}`, target) || [];
      const bodyParamDef: Parameter = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}${String(property)}`, target);
      Reflect.defineProperty(target, name, {
        configurable: false,
        value: createResourceMethod(this, httpStrategyMethod, method, options, headerParamsDef, pathParamsDef, queryParamsDef, bodyParamDef),
        writable: false
      });
    }
  }

  return DeleteDecorator;
};
