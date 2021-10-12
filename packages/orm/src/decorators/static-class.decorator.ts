export const StaticClassAccesor = (metadataKey: string, metadataValue: any): ClassDecorator => {
  const StaticDecorator = <TFunction extends Function>(target: TFunction) => {
    Reflect.defineMetadata(metadataKey, metadataValue, target.prototype);
    Reflect.defineProperty(target, metadataKey, {
      enumerable: false,
      configurable: false,
      value: metadataValue,
      writable: false
    });
  }
  return StaticDecorator;
}
