import { TypeRef } from '../types';
import { INJECT } from './constants';

export const Inject = (reference: TypeRef<any>): ParameterDecorator => {
  const injectDecorator = (target: any, _property: string | symbol, index: number): void => {
    const metadataKey = `${INJECT}${String(target.name || '')}`;
    const params: any[] = Reflect.getOwnMetadata(metadataKey, target) || [];
    if (params.findIndex((param: any) => param.index === index) === -1) {
      params.unshift({ reference, index });
    }
    Reflect.defineMetadata(metadataKey, params, target);
  };
  return injectDecorator;
}
