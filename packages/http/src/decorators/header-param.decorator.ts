import { HEADER_PARAMS, METHOD, Parameter } from '../types';

export const HeaderParam = (name: string): ParameterDecorator => {
  const HeaderParamDecorator = (target: Object, property: string | symbol, index: number): void => {
    const metadataKey = `${METHOD}${HEADER_PARAMS}${String(property)}`;
    const params: Parameter[] = Reflect.getOwnMetadata(metadataKey, target) || [];
    if (params.findIndex((param: Parameter) => param.name === property) === -1) {
      params.unshift({ name, index });
    }
    Reflect.defineMetadata(metadataKey, params, target);
  }
  return HeaderParamDecorator;
}
