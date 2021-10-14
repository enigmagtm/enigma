import { METHOD, PathParameter, PATH_PARAMS } from '../types';

export const PathParam = (name: string): ParameterDecorator => {
  const PathParamDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${PATH_PARAMS}${String(property)}`;
    const params: PathParameter[] = Reflect.getOwnMetadata(metadataKey, target) || [];
    if (params.findIndex((param: PathParameter) => param.index === index) === -1) {
      params.unshift({ name, index });
    }
    Reflect.defineMetadata(metadataKey, params, target);
  }
  return PathParamDecorator;
}
