import { NextFunction, Request, RequestHandler, Response } from '@enigmagtm/core';
import { CustomHttpMethod, Parameter, QueryParameter } from '../types';

export const createResourceMethod = (target: any, httpMethod: CustomHttpMethod, method: any, options: any, headerParamsDef: Parameter[], pathParamsDef: Parameter[], queryParamsDef: QueryParameter[], bodyParamDef: Parameter): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    await httpMethod(target, method, args, { res, req, next, options });
  };
};
