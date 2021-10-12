export type FieldType = 'number' | 'string' | 'boolean' | 'Date' | 'bigint' | 'unknown';

export const numberTypes = ['number', 'bigint'];

export interface FieldInfo {
  name: string;
  type: FieldType;
  regex?: string;
}
