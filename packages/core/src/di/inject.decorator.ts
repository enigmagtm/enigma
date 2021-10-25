import { Property } from '../types';
import { INJECT } from './constants';

export const Inject = (): PropertyDecorator => {
  const InjectDecorator = (target: any, property: string | symbol): void => {
    const targetClass = target.constructor;
    const metadataKey = `${INJECT}${targetClass.name}`;
    const properties: Property[] = Reflect.getOwnMetadata(metadataKey, targetClass) || [];
    const type = Reflect.getMetadata('design:type', target, property);
    properties.push({ name: String(property), type });
    Reflect.defineMetadata(metadataKey, properties, targetClass);
  }
  return InjectDecorator;
}
