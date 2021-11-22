import fs from 'fs';
import { capitalize } from 'lodash';
import { join, sep } from 'path';
import prompt from 'prompt-sync';
import { createFolders } from '../utils';

export const createModule = (folderPath: string, module: string) => {
  try {
    const folders = folderPath.split(sep);
    const folder = createFolders(folders);
    module = module || folders[folders.length - 1];
    const filename = join(folder, `${module}.module.ts`);
    if (fs.existsSync(filename)) {
      const ask = prompt({ sigint: true });
      const yesNo = ask('File already exists, replace existing file? y/n ') || 'n';
      if (yesNo.toLowerCase() !== 'y') {
        console.log('Process aborted');
        process.exit();
      }
    }

    if (fs.existsSync(filename)) {
      fs.rmSync(filename);
    }

    const className = capitalize(module);
    const file =
    `import { HttpResourceModule, ResourceController, ResourceOptions } from '@enigmagtm/http';

const resources: ResourceController[] = [];

@ResourceOptions({
  path: '/${module}',
  resources
})
export class ${className}Module extends HttpResourceModule { }

`;
    fs.writeFileSync(filename, file);
  } catch (e: any) {
    console.log(`Error in process ${e.message}`);
  }
};
