import { SCHEMA, TABLE } from './constants';
import { staticClassAccesor } from './static-class.decorator';

export const Table = (name: string, schema?: string): ClassDecorator => {
  const tableDecorator = <TFunction extends Function>(target: TFunction): void => {
    staticClassAccesor(TABLE, name)(target);
    staticClassAccesor(SCHEMA, schema)(target);
  }

  return tableDecorator;
}
