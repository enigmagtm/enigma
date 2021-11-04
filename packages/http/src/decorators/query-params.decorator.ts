import { METHOD, QUERY_PARAMS } from '../types';

export const QueryParams = (name: string): ParameterDecorator => {
  const QueryParamsDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${QUERY_PARAMS}${String(property)}`;
    Reflect.defineMetadata(metadataKey, { name, index }, target);
  }
  return QueryParamsDecorator;
}
