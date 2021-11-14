import fs from 'fs';
import { capitalize } from 'lodash';
import { join } from 'path';

export const createController = (folderPath: string, model: string) => {
  const filename = join(folderPath, `${model}.controller.ts`);
  if (fs.existsSync(filename)) {
    fs.rmSync(filename);
  }

  const className = capitalize(model);
  const file =
    `import { Inject, Injectable } from '@enigmagtm/core';
import { ModelController, ModelResourceController } from '@enigmagtm/rsc';
import { ${className}DAO } from './${model}.dao';
import { ${className} } from './${model}.model';

@Injectable()
export class ${className}Ctrl extends ModelResourceController<${className}> implements ModelController<${className}> {
  @Inject() readonly dao: ${className}DAO;
}

`;
  fs.writeFileSync(filename, file);
};