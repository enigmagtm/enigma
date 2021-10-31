import { METHOD, Parameter, PATH_PARAM } from '../types';

export const PathParam = (name: string): ParameterDecorator => {
  const PathParamDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${PATH_PARAM}${String(property)}`;
    const params: Parameter[] = Reflect.getOwnMetadata(metadataKey, target) || [];
    if (params.findIndex((param: Parameter) => param.index === index) === -1) {
      params.unshift({ name, index });
    }
    Reflect.defineMetadata(metadataKey, params, target);
  }
  return PathParamDecorator;
}
