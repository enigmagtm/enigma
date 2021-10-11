import { Knex } from 'knex';

export type Connection = Knex<any, unknown[]>;
export type Transaction = Knex.Transaction;
export type QueryBuilder = Knex.QueryBuilder;
