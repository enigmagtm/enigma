import { Model } from '../model';

export interface Operations {
  getAll?: boolean;
  getById?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface FindResult<T extends Model> {
  data: T[];
  rows: number;
}
