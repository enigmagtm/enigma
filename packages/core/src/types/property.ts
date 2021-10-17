import { TypeRef } from './types';

export interface Property {
  name: string;
  type: TypeRef<any>;
  fieldType: string;
}
