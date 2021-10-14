import { NextFunction, Request, Response } from '../types';

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void;
export type RequestHandlerError = (error: any, req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void;
export type RequestExecutor = ((fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | Response | void);
export const fnAsyncHandler = ((fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> | Response | void =>
    Promise.resolve(fn(req, res, next)).catch(next));
export const asyncHandler: RequestExecutor = fnAsyncHandler;

export interface HTTPParams {
  res: Response;
  req: Request;
  next: NextFunction;
  options?: any;
}
