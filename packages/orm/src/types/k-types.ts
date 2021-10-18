import { Knex } from 'knex';

export type Connection = Knex<any, unknown[]>;
export type Transaction = Knex.Transaction;
export type QueryBuilder = Knex.QueryBuilder;
export type Config = Knex.Config;
export type TransactionConfig = Knex.TransactionConfig;
export type TransactionFn = (config?: TransactionConfig) => Promise<Transaction>;
