import { RequestHandler, RequestHandlerError, Server, ServerTypeRef } from '../types';

export interface ModuleOptions {
  imports: ServerTypeRef<any>[];
  middlewares?: RequestHandler[];
  errorMiddlewares?: RequestHandlerError[];
}

export const Module = (options: ModuleOptions): ClassDecorator => {
  const ModuleDecorator = <TFunction extends Function>(target: TFunction): TFunction => {
    const original = target as any;
    const modules: any[] = [];
    const construct: any = function (server: Server) {
      if (options.middlewares) {
        server.use(options.middlewares);
      }

      for (const reference of options.imports) {
        modules.push(new reference(server));
      }

      if (options.errorMiddlewares) {
        server.use(...options.errorMiddlewares);
      }

      const instance = new original(server);

      // TODO add instances of modules
      instance.modules = modules;
      return instance;
    }

    construct.prototype = original.prototype;
    return construct;
  }
  return ModuleDecorator;
}
