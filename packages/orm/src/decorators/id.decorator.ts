import { FieldInfo } from '../types';
import { PRIMARY_KEYS } from './constants';

export const Id = (): PropertyDecorator => {
  const IdDecorator = (target: Object, property: string | symbol): void => {
    const targetClass = target.constructor;
    const primaryKeys: FieldInfo[] = Reflect.getOwnMetadata(PRIMARY_KEYS, targetClass) || [];
    const type = Reflect.getMetadata('design:type', target, property);
    const fieldType = type.name.toLowerCase();
    primaryKeys.push({ name: String(property), type: fieldType });
    Reflect.defineMetadata(PRIMARY_KEYS, primaryKeys, targetClass);
    Reflect.defineProperty(targetClass, PRIMARY_KEYS, {
      enumerable: false,
      configurable: false,
      value: primaryKeys,
      writable: false
    });
  }
  return IdDecorator;
}
