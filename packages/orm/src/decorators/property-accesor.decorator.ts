export const propertyAccesor = (metadataKey: string): PropertyDecorator => {
  const propertyDecorator = (target: Object, property: string | symbol): void => {
    Reflect.defineMetadata(metadataKey, property, target);
  }
  return propertyDecorator;
}
