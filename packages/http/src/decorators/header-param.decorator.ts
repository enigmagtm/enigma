import { HeaderParameter, HEADER_PARAMS, METHOD } from '../types';

export const HeaderParam = (name: string): ParameterDecorator => {
  const HeaderParamDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${HEADER_PARAMS}${String(property)}`;
    const params: HeaderParameter[] = Reflect.getOwnMetadata(metadataKey, target) || [];
    if (params.findIndex((param: HeaderParameter) => param.name === property) === -1) {
      params.unshift({ name, index });
    }
    Reflect.defineMetadata(metadataKey, params, target);
  }
  return HeaderParamDecorator;
}
