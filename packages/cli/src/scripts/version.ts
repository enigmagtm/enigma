import { execSync } from 'child_process';
import { normalize } from 'path';

export const updateVersion = (config: any, ...args: string[]) => {
  console.log('Update project version');
  const [ver] = args;
  const [, versionId] = (ver || '-v=patch').split('=');
  const path = normalize(config.rootDir);
  const newVersion = execSync(`cd ${path} && npm version ${versionId}`, { encoding: 'utf8' });
  if (config.updateVersion) {
    execSync(`cd ${path} && git commit -am ":bookmark: update to version ${newVersion}"`);
  }
};
