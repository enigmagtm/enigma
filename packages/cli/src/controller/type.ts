const stringType = ['text', 'character varying'];
const numberTypes = ['integer', 'bigint'];

export const getType = (_client: string, type: string) => {
  if (stringType.indexOf(type) > -1) {
    return 'string';
  }

  if (numberTypes.indexOf(type) > -1) {
    return 'number';
  }

  return type;
};
