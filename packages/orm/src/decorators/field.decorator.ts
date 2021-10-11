import { FieldInfo } from '../types';
import { FIELDS } from './constants';

export const Field = (): PropertyDecorator => {
  const fieldDecorator = (target: Object, property: string | symbol): void => {
    const targetClass = target.constructor;
    const fields: FieldInfo[] = Reflect.getOwnMetadata(FIELDS, targetClass) || [];
    const type = Reflect.getMetadata('design:type', target, property);
    const fieldType = type.name.toLowerCase();
    fields.push({ name: String(property), type: fieldType });
    Reflect.defineMetadata(FIELDS, fields, targetClass);
    Reflect.defineProperty(targetClass, FIELDS, {
      enumerable: false,
      configurable: false,
      value: fields,
      writable: false
    });
  }
  return fieldDecorator;
}
