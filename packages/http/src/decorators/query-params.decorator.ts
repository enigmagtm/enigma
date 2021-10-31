import { METHOD, QUERY_PARAMS } from '../types';

export const QueryParams = (): ParameterDecorator => {
  const QueryParamsDecorator = (target: Object, property: string | symbol, index: number): void => {
    const name = String(property);
    const metadataKey = `${METHOD}${QUERY_PARAMS}${name}`;
    Reflect.defineMetadata(metadataKey, { name, index }, target);
  }
  return QueryParamsDecorator;
}
