import { knex } from 'knex';
import { Config, Connection, Transaction, TransactionConfig } from '../types';

let $db: Connection;

export const initializeConnection = (config: Config) => {
  if ($db === undefined) {
    $db = knex(config);
  }

  return $db;
};

export const connection = (schema?: string): Connection => {
  if ($db === undefined) {
    throw new Error('Connection not initialized.');
  }

  if (schema) {
    return ($db.withSchema(schema) as unknown) as Connection;
  }

  return $db;
};

export const transaction = async (config?: TransactionConfig): Promise<Transaction> => {
  if ($db === undefined) {
    throw new Error('Connection not initialized.');
  }
  return await $db.transaction.bind($db)(config);
};
