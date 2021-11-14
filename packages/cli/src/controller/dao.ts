import fs from 'fs';
import { capitalize } from 'lodash';
import { join } from 'path';

export const createDataAccessObject = (folderPath: string, model: string) => {
  const filename = join(folderPath, `${model}.dao.ts`);
  if (fs.existsSync(filename)) {
    fs.rmSync(filename);
  }

  const className = capitalize(model);
  const file =
    `import { ModelAccess } from '@enigmagtm/orm';
import { ${className} } from './${model}.model';

export class ${className}DAO extends ModelAccess<${className}> {
  constructor() {
    super(${className});
  }
}

`;
  fs.writeFileSync(filename, file);
};
