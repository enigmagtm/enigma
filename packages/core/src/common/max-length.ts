export const MaxLength = (max: number): PropertyDecorator => {
  const maxLengthDecorator = (target: Object, property: string | symbol): void => {
    let value: string;
    const getter = function (): string {
      return value;
    };

    const setter = function (newValue: string) {
      if (newValue.length > max) {
        newValue = newValue.substring(1, max);
      }
      value = newValue;
    };

    Object.defineProperty(target, property, {
      get: getter,
      set: setter
    });
  };
  return maxLengthDecorator;
};
