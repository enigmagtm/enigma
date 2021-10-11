import { ORDER_BY } from './constants';

export const OrderBy = (): PropertyDecorator => {
  const orderByDecorator = (target: Object, property: string | symbol): void => {
    const targetClass = target.constructor;
    const orderByList: string[] = Reflect.getOwnMetadata(ORDER_BY, targetClass) || [];
    orderByList.push(String(property));
    Reflect.defineMetadata(ORDER_BY, orderByList, targetClass);
    Reflect.defineProperty(targetClass, ORDER_BY, {
      enumerable: false,
      configurable: false,
      value: orderByList,
      writable: false
    });
  }
  return orderByDecorator;
}