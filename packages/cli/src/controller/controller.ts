import fs from 'fs';
import { capitalize } from 'lodash';

export const createController = (folderPath: string, modulePath: string) => {
  if (!fs.existsSync(`${folderPath}/${modulePath}.controller.ts`)) {
    const mdlCap = capitalize(modulePath);
    const mdlContent =
      `import { Inject, Injectable } from '@enigmagtm/core';
import { ModelController, ModelResourceController } from '@enigmagtm/rsc';
import { ${mdlCap}DAO } from './${modulePath}.dao';
import { ${mdlCap} } from './${modulePath}.model';

@Injectable()
export class ${mdlCap}Ctrl extends ModelResourceController<${mdlCap}> implements ModelController<${mdlCap}> {
  @Inject() readonly dao: ${mdlCap}DAO;
}

`;
    console.log('Writting file for controller ...');
    fs.writeFileSync(`${folderPath}/${modulePath}.controller.ts`, mdlContent);
  }
};