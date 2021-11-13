import fs from 'fs';
import { knex } from 'knex';
import { capitalize } from 'lodash';
import { getType } from './type';

export const createModel = async (folderPath: string, modulePath: string, schema: string, tableName: string) => {
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
    console.log('Getting info from database ...');
    const columnInfo: any = await db(tableName).withSchema(schema).columnInfo();
    console.log('Creating class fields ...');
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

  if (!fs.existsSync(`${folderPath}/${modulePath}.model.ts`)) {
    const mdlContent =
      `import { Field, ${importId}Model, Table } from '@enigmagtm/orm';

@Table('${tableName}', '${schema}')
export class ${capitalize(modulePath)} extends Model {${fields}
}
`;
    console.log('Writting file for model ...');
    fs.writeFileSync(`${folderPath}/${modulePath}.model.ts`, mdlContent);
  }
};