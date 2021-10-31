import { METHOD, PATH_PARAMS } from '../types';

export const PathParams = (): ParameterDecorator => {
  const PathParamsDecorator = (target: Object, property: string | symbol, index: number): void => {
    const name = String(property);
    const metadataKey = `${METHOD}${PATH_PARAMS}${name}`;
    Reflect.defineMetadata(metadataKey, { name, index }, target);
  }
  return PathParamsDecorator;
}
