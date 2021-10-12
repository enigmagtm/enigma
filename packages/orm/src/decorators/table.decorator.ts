import { SCHEMA, TABLE } from './constants';
import { StaticClassAccesor } from './static-class.decorator';

export const Table = (name: string, schema?: string): ClassDecorator => {
  const TableDecorator = <TFunction extends Function>(target: TFunction): void => {
    StaticClassAccesor(TABLE, name)(target);
    StaticClassAccesor(SCHEMA, schema)(target);
  }

  return TableDecorator;
}
