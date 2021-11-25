import { execSync } from 'child_process';
import fs from 'fs';
import { join, normalize } from 'path';

export const generateTags = (_config: any, ..._args: string[]) => {
  console.log('Create tag and update project');
  const filename = 'package.json';
  const path = normalize(_config.rootDir);
  const file = join(path, filename);
  if (!fs.existsSync(file)) {
    console.log(`Package configuration file not found. [${file}]`);
    process.exit();
  }

  const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
  execSync(`cd ${path} && git tag v${packageJson.version} && git push --tags`);
};
