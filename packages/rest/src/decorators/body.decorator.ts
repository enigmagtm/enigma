import { BODY_PARAM, METHOD } from '../types';

export const Body = (): ParameterDecorator => {
  const BodyDecorator = (target: Object, property: string | symbol, index: number): void => {
    Reflect.defineMetadata(`${METHOD}${BODY_PARAM}${String(property)}`, { name: property, index }, target);
  }
  return BodyDecorator;
}
