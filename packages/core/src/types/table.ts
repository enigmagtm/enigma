// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Table { }

export interface BaseRecord<T> extends Table {
  id: T;
}
