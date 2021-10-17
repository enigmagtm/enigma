import { Property } from '../types';
import { INJECT } from './constants';

export const Injectable = (): ClassDecorator => {
  const InjectableDecorator = <TFunction extends Function>(target: TFunction): TFunction => {
    const properties: Property[] = Reflect.getOwnMetadata(`${INJECT}${target.name}`, target) || [];
    const original = target as any;
    const construct: any = function (...args: any[]) {
      const instance = new original(...args);
      for (const prop of properties) {
        const { name, type } = prop;
        instance[name] = new type();
      }

      return instance;
    }

    construct.prototype = original.prototype;
    return construct;
  };
  return InjectableDecorator;
}
