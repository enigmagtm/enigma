import { HttpVerb, Method, METHODS } from '../types';

export const HttpMethodDecorator = (target: Object, property: string | symbol, httpVerb: HttpVerb, options: Method): void => {
  const methods: Method[] = Reflect.getOwnMetadata(`${METHODS}${httpVerb}`, target) || [];
  if (methods.findIndex((param: Method) => param.path === options?.path) !== -1) {
    throw new Error(`Duplicated resource paths on method ${String(property)} [${httpVerb}] [${options.path || ''}]`);
  }

  methods.push(options);
  Reflect.defineMetadata(`${METHODS}${httpVerb}`, methods, target);
}
