/**
 * Enigma core types
 */

import { NextFunction, Request, Response } from './e-types';

export interface TypeRef<T> extends Function {
  new(...args: any[]): T;
}

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void;
export type RequestHandlerError = (error: any, req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void;
export type RequestExecutor = ((fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void);
export const fnAsyncHandler = ((fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> | Response | void =>
    Promise.resolve(fn(req, res, next)).catch(next));
export const asyncHandler: RequestExecutor = fnAsyncHandler;

