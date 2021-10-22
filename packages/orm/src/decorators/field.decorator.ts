import { ColumnOptions, FieldInfo } from '../types';
import { FIELDS } from './constants';

export const Field = (options?: ColumnOptions): PropertyDecorator => {
  const FieldDecorator = (target: Object, property: string | symbol): void => {
    const targetClass = target.constructor;
    const fields: FieldInfo[] = Reflect.getOwnMetadata(FIELDS, targetClass) || [];
    const type = Reflect.getMetadata('design:type', target, property);
    const fieldType = type.name.toLowerCase();
    fields.push({ name: String(property), type: fieldType, mapTo: options?.mapTo });
    Reflect.defineMetadata(FIELDS, fields, targetClass);
    Reflect.defineProperty(targetClass, FIELDS, {
      enumerable: false,
      configurable: false,
      value: fields,
      writable: false
    });
  }
  return FieldDecorator;
}
