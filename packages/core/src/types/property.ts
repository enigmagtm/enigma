import { TypeRef } from './types';

export interface Property {
  name: string;
  type: TypeRef<any>;
}
