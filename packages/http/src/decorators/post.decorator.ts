import { CustomHttpMethod, HttpParams, HttpStatus, HttpVerb, RESOURCE_METHOD } from '../types';
import { HttpMethodDecorator } from './http-method.decorator';
import { createResourceMethod, getResourceParameters } from './resource-method';

let customMethod: CustomHttpMethod = async (target: Object, method: any, args: any[], params: HttpParams): Promise<void> => {
  try {
    const result = await method.apply(target, args);
    (params.res as any).res.status(params.options?.status || HttpStatus.OK).json(result);
  } catch (e) {
    params.next(e);
  }
};

const httpStrategyMethod: CustomHttpMethod = async (target: Object, method: any, args: any[], params: HttpParams): Promise<void> => {
  return customMethod(target, method, args, params);
};

export const configurePostMethod = (method: CustomHttpMethod) => {
  customMethod = method;
};

export const Post = (options?: any): MethodDecorator => {
  const PostDecorator = (target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
    const method = descriptor.value;
    if (method) {
      const name = `${String(property)}${RESOURCE_METHOD}`;
      options = { ...{ name }, ...options };
      HttpMethodDecorator(target, name, HttpVerb.POST, options);
      const params = getResourceParameters(target, String(property));
      Reflect.defineProperty(target, name, {
        configurable: false,
        value: createResourceMethod(this, httpStrategyMethod, method, options, params),
        writable: false
      });
    }
  }

  return PostDecorator;
};
