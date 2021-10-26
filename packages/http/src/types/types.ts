import { NextFunction, Request, Response } from '@enigmagtm/core';

export interface HttpParams {
  res: Response;
  req: Request;
  next: NextFunction;
  options?: any;
}

export type CustomHttpMethod = (target: Object, method: any, args: any[], params: HttpParams) => Promise<void> | void;
