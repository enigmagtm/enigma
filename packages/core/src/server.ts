import express from 'express';
import { NextFunction, Request, Response, TypeRef } from './types';

interface ServerOptions {
  port?: number;
  poweredBy?: boolean;
}

type BootstrapModule = (module: TypeRef<any>, options?: ServerOptions) => void;
export interface EnigmaServer {
  bootstrap: BootstrapModule;
}

export const enigmaServer: EnigmaServer = {
  bootstrap(module: TypeRef<any>, options: ServerOptions = {}): void {
    const { port = 36442, poweredBy = false } = options;
    const server = express();
    if (poweredBy) {
      server.disable('x-powered-by');
    }

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
  }
};
