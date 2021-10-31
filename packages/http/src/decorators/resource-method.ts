import { NextFunction, Request, RequestHandler, Response } from '@enigmagtm/core';
import { BODY_PARAM, CustomHttpMethod, HEADER_PARAMS, METHOD, Parameter, PATH_PARAM, PATH_PARAMS, QueryParameter, QUERY_PARAMS } from '../types';

export interface ResourceParameters {
  headerParamsDef?: Parameter[];
  pathParamsDef?: Parameter[];
  pathParams?: Parameter;
  queryParamsDef?: QueryParameter[];
  queryParams?: Parameter;
  bodyParamDef?: Parameter;
}

export const getResourceParameters = (target: Object, property: string): ResourceParameters => {
  const headerParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${HEADER_PARAMS}${String(property)}`, target);
  const pathParamsDef: Parameter[] = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAM}${String(property)}`, target);
  const pathParams: Parameter = Reflect.getOwnMetadata(`${METHOD}${PATH_PARAMS}${String(property)}`, target);
  const queryParamsDef: QueryParameter[] = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}${String(property)}`, target);
  const queryParams: Parameter = Reflect.getOwnMetadata(`${METHOD}${QUERY_PARAMS}${String(property)}`, target);
  const bodyParamDef: Parameter = Reflect.getOwnMetadata(`${METHOD}${BODY_PARAM}${String(property)}`, target);
  return { headerParamsDef, pathParamsDef, pathParams, queryParamsDef, queryParams, bodyParamDef };
}

export const createResourceMethod = (target: any, httpMethod: CustomHttpMethod, method: any, options: any, params: ResourceParameters): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { headerParamsDef, pathParamsDef, pathParams, queryParamsDef, queryParams, bodyParamDef } = params;
    const headerParamsValues = headerParamsDef?.map((param: Parameter) => ({ ...param, value: req.get(param.name) })) || [];
    const pathParamsValues = pathParamsDef?.map((param: Parameter) => ({ ...param, value: req.params[param.name] })) || [];
    const queryParamsValues = queryParamsDef?.map((param: Parameter) => ({ ...param, value: req.query[param.name] })) || [];
    const orderedParams: Parameter[] = [...headerParamsValues, ...pathParamsValues, ...queryParamsValues];
    if (pathParams) {
      orderedParams.push({ ...pathParams, value: req.params });
    }

    if (queryParams) {
      orderedParams.push({ ...queryParams, value: req.query });
    }

    if (bodyParamDef) {
      orderedParams.push({ ...bodyParamDef, value: req.body });
    }

    const args = [];
    for (const param of orderedParams.sort((a: Parameter, b: Parameter) => a.index - b.index)) {
      args.push(param.value);
    }

    await httpMethod(target, method, args, { res, req, next, options });
  };
};
