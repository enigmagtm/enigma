import { NextFunction, Request, Response, Router } from '@enigmagtm/core';
import { HttpStatus } from './http-status';

export type RegisterMethod = (router: Router) => Router;

export const METHOD = 'METHOD_';
export const METHODS = 'METHODS_';
export const HEADER_PARAMS = 'HEADER_PARAMS_';
export const PATH_PARAMS = 'PATH_PARAMS_';
export const QUERY_PARAMS = 'QUERY_PARAMS_';
export const BODY_PARAM = 'BODY_PARAM_';
export const RESOURCE_METHOD = 'Resource';
export const ROUTER = 'ROUTER';

export interface Parameter {
  name: string;
  index: number;
  value?: any;
}

export interface HeaderParameter extends Parameter {
  name: string;
}

export interface PathParameter extends Parameter {
  name: string;
}

export interface QueryParameter extends Parameter {
  default: any;
}

export interface Method {
  name: string;
  path?: string;
}

export interface HttpOptions {
  name: string;
  status: HttpStatus;
}

export interface HttpParams {
  res: Response;
  req: Request;
  next: NextFunction;
  options?: HttpOptions;
}

export type CustomHttpMethod = (target: Object, method: any, args: any[], params: HttpParams) => Promise<void> | void;
