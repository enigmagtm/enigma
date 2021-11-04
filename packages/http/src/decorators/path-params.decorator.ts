import { METHOD, PATH_PARAMS } from '../types';

export const PathParams = (name: string): ParameterDecorator => {
  const PathParamsDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${PATH_PARAMS}${String(property)}`;
    Reflect.defineMetadata(metadataKey, { name, index }, target);
  }
  return PathParamsDecorator;
}
