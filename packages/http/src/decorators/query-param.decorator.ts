import { METHOD, QueryParameter, QUERY_PARAMS } from '../types';

export const QueryParam = (name: string, defaultValue: any = null): ParameterDecorator => {
  const QueryParamDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${QUERY_PARAMS}${String(property)}`;
    const params: QueryParameter[] = Reflect.getOwnMetadata(metadataKey, target) || [];
    if (params.findIndex((param: QueryParameter) => param.index === index) === -1) {
      params.unshift({ name, default: defaultValue, index });
    }
    Reflect.defineMetadata(metadataKey, params, target);
  }
  return QueryParamDecorator;
}
