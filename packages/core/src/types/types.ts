/**
 * Enigma core types
 */

export interface TypeRef<T> extends Function {
  new(...args: any[]): T;
}

