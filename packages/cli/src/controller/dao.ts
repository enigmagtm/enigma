import fs from 'fs';
import { capitalize } from 'lodash';

export const createDAO = (folderPath: string, modulePath: string) => {
  if (!fs.existsSync(`${folderPath}/${modulePath}.dao.ts`)) {
    const mdlCap = capitalize(modulePath);
    const mdlContent =
      `import { ModelAccess } from '@enigmagtm/orm';
import { ${mdlCap} } from './${modulePath}.model';

export class ${mdlCap}DAO extends ModelAccess<${mdlCap}> {
  constructor() {
    super(${mdlCap});
  }
}

`;
    console.log('Writting file for data access object ...');
    fs.writeFileSync(`${folderPath}/${modulePath}.dao.ts`, mdlContent);
  }
}