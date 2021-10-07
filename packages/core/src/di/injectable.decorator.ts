import { isNil } from 'lodash';
import { TypeRef } from '../types';
import { INJECT } from './constants';

export const Injectable = (): ClassDecorator => {
  const injectableDecorator = <TFunction extends Function>(target: TFunction): TFunction => {
    const params: any[] = Reflect.getOwnMetadata(`${INJECT}${target.name}`, target) || [];
    const sizeParamas = params.reduce((index: number, param: any) => index > param.index ? index : param.index, -1) + 1;
    const original = target as any;
    const construct: any = function (...args: any[]) {
      if (sizeParamas > args.length) {
        args.length = sizeParamas;
      }

      for (const param of params) {
        if (isNil(args[param.index])) {
          const reference: TypeRef<any> = param.reference;
          args[param.index] = new reference();
        }
      }

      return new original(...args);
    }

    construct.prototype = original.prototype;
    return construct;
  };
  return injectableDecorator;
}
