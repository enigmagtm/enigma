import fs from 'fs';
import { knex } from 'knex';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import { format } from '../utils';
import { getType } from '../utils/type';

export const createModel = async (path: string, model: string, schema: string, table: string, database?: string): Promise<void> => {
  let fields = ``;
  let importId = '';
  const generateDefaultModel = (): void => {
    importId = 'Id, ';
    fields = `
  @Id()
  @Field()
  id!: number;
  @Field()
  userCreateId!: number;
  @Field()
  createdAt!: number;
  @Field()
  userUpdateId?: number;
  @Field()
  updatedAt?: number;
  `
  };
  const dbString = database && process.env[database];
  if (!dbString) {
    generateDefaultModel();
  } else {
    try {
      const { client, version, connection, pool } = JSON.parse(dbString);
      const config = {
        client,
        version,
        connection,
        pool: {
          min: pool.min,
          max: pool.max
        }
      };
      const db = knex(config);
      try {
        const columnInfo: any = await db(table).withSchema(schema).columnInfo();
        for (const field of Object.keys(columnInfo)) {
          const info = columnInfo[field];
          if (field === 'id') {
            importId = 'Id, ';
            fields = fields + `
  @Id()`;
          }
          fields = fields + `
  @Field()
  ${field}${info.nullable ? '?' : '!'}: ${getType(client, info.type)};`;
        }
      } finally {
        db.destroy();
      }
    } catch (e: any) {
      console.log('Error connecting to database. Generating default model.'.yellow, `Error: ${e.message}`.red);
      generateDefaultModel();
    }
  }

  const filename = join(path, `${model}.model.ts`);
  fs.rmSync(filename, { force: true });
  const dirname = __dirname.split(sep);
  dirname.pop();
  const file = fs.readFileSync(join(...dirname, 'assets', 'model.file'), 'utf8');
  fs.writeFileSync(filename, format(file, importId, schema, model, capitalize(model), fields), { encoding: 'utf8' });
};
