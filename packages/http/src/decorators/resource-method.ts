import { NextFunction, Request, RequestHandler, Response } from '@enigmagtm/core';
import { BODY_PARAM, CustomHttpMethod, HEADER_PARAMS, METHOD, Parameter, PATH_PARAMS, QueryParameter, QUERY_PARAMS } from '../types';

export interface ResourceParameters {
  headerParamsDef?: Parameter[];
  pathParamsDef?: Parameter[];
  queryParamsDef?: QueryParameter[];
  bodyParamDef?: Parameter;
}

export const getResourceParameters = (target: Object, property: string): ResourceParameters => {
  const headerParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${HEADER_PARAMS}${String(property)}`, target);
  const pathParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}${String(property)}`, target);
  const queryParamsDef: QueryParameter[] = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}${String(property)}`, target);
  const bodyParamDef: Parameter = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}${String(property)}`, target);
  return { headerParamsDef, pathParamsDef, queryParamsDef, bodyParamDef };
}

export const createResourceMethod = (target: any, httpMethod: CustomHttpMethod, method: any, options: any, params: ResourceParameters): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req = (req as any);
    const { headerParamsDef, pathParamsDef, queryParamsDef, bodyParamDef } = params;
    const headerParams = headerParamsDef?.map((param: Parameter) => ({ ...param, value: req.get(param.name) })) || [];
    const pathParams = pathParamsDef?.map((param: Parameter) => ({ ...param, value: req.params[param.name] })) || [];
    const queryParams = queryParamsDef?.map((param: Parameter) => ({ ...param, value: req.query[param.name] })) || [];
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
