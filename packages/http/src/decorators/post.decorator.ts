import { NextFunction, Request, Response } from '@enigmagtm/core';
import {
  BODY_PARAM, CustomHttpMethod, HEADER_PARAMS, HttpParams, HttpStatus, HttpVerb, METHOD, Parameter, PATH_PARAMS, QueryParameter,
  QUERY_PARAMS, RESOURCE_METHOD
} from '../types';
import { HttpMethodDecorator } from './http-method.decorator';

let customMethod: CustomHttpMethod = async (target: Object, method: any, args: any[], params: HttpParams): Promise<void> => {
  try {
    const result = await method.apply(target, args);
    (params.res as any).res.status(params.options?.status || HttpStatus.OK).json(result);
  } catch (e) {
    params.next(e);
  }
};

export const configurePostMethod = (method: CustomHttpMethod) => {
  customMethod = method;
};

export const Post = (options?: any): MethodDecorator => {
  const PostDecorator = (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
    const method = descriptor.value;
    if (method) {
      const name = `${String(property)}${RESOURCE_METHOD}`;
      options = { ...{ name }, ...options };
      HttpMethodDecorator(target, name, HttpVerb.POST, options);
      const headerParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${HEADER_PARAMS}${String(property)}`, target) || [];
      const pathParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}${String(property)}`, target) || [];
      const queryParamsDef: QueryParameter[] = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}${String(property)}`, target) || [];
      const bodyParamDef: Parameter = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}${String(property)}`, target);
      Reflect.defineProperty(target, name, {
        configurable: false,
        value: async function (res: Response, req: Request, next: NextFunction): Promise<void> {
          req = (req as any);
          const headerParams = headerParamsDef.map((param: Parameter) => ({ ...param, value: req.get(param.name) }));
          const pathParams = pathParamsDef.map((param: Parameter) => ({ ...param, value: req.params[param.name] }));
          const queryParams = queryParamsDef.map((param: Parameter) => ({ ...param, value: req.query[param.name] }));
          const orderedParams: Parameter[] = [...headerParams, ...pathParams, ...queryParams];
          if (bodyParamDef) {
            orderedParams.push(bodyParamDef);
          }

          const args = [];
          for (const param of orderedParams.sort((a: Parameter, b: Parameter) => a.index - b.index)) {
            args.push(param.value);
          }

          await customMethod(this, method, args, { res, req, next, options });
        },
        writable: false
      });
    }
  }

  return PostDecorator;
};
