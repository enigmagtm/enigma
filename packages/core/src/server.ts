import express from 'express';
import { NextFunction, Request, Response, TypeRef } from './types';

export const boostrapModule = (module: TypeRef<any>, port: number, poweredBy?: boolean): void => {
  const server = express();
  if (poweredBy) server.disable('x-powered-by');
  server.listen(port, () => console.log(`Server running on port ${port}`))
  new module(server);
  server.get('*', (_req: Request, res: Response, next: NextFunction): Promise<Response | void> | Response | void => {
    if (!res.headersSent) {
      return res.status(404).json({
        err: 'Url not found on server'
      });
    }
    return next();
  });
};
