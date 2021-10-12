export const PropertyAccesor = (metadataKey: string): PropertyDecorator => {
  const PropertyDecorator = (target: Object, property: string | symbol): void => {
    Reflect.defineMetadata(metadataKey, property, target);
  }
  return PropertyDecorator;
}
