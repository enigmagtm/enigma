export interface DefaultParams {
  info?: any;
}

export interface GetAllParams extends DefaultParams {
  sfields?: string[];
  offset?: number;
  limit?: number;
  useLimit?: boolean;
  where?: any;
}

export interface Param {
  operator: string;
  value: string;
}

export interface Params {
  key: string;
  value: Param | any;
}
