import fs from 'fs';
import { knex } from 'knex';
import { capitalize } from 'lodash';
import { join } from 'path';
import { getType } from '../utils/type';

export const createModel = async (folderPath: string, model: string, schema: string, table: string) => {
  let fields = ``;
  let importId = '';
  const dbString = process.env.ENIGMA_DB;
  if (dbString) {
    const { client, version, connectionOptions: connection, pool } = JSON.parse(dbString);
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
  } else {
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
  }

  const filename = join(folderPath, `${model}.model.ts`);
  if (fs.existsSync(filename)) {
    fs.rmSync(filename);
  }

  const file =
    `import { Field, ${importId}Model, Table } from '@enigmagtm/orm';

@Table('${table}', '${schema}')
export class ${capitalize(model)} extends Model {${fields}
}
`;
  fs.writeFileSync(filename, file);
};