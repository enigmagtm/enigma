import express from 'express';
import { NextFunction, Request, Response, ServerTypeRef } from '../types';

interface ServerOptions {
  port?: number;
  poweredBy?: boolean;
  runServer: boolean;
}

type BootstrapModule = (module: ServerTypeRef<any>, options?: ServerOptions) => any;
export interface EnigmaServer {
  bootstrap: BootstrapModule;
}

export const enigmaServer: EnigmaServer = {
  bootstrap<T>(module: ServerTypeRef<T>, options: ServerOptions = { runServer: true }): T {
    const { port = 36442, poweredBy = false } = options;
    const server = express();
    if (poweredBy) {
      server.disable('x-powered-by');
    }

    if (options.runServer) {
      server.listen(port, () => console.log(`Server running on port ${port}`));
    }

    const instance = new module(server);
    server.get('*', (_req: Request, res: Response, next: NextFunction): Promise<Response | void> | Response | void => {
      if (!res.headersSent) {
        return res.status(404).json({
          err: 'Url not found on server'
        });
      }

      return next();
    });
    return instance;
  }
};
