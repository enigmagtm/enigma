import { normalize } from 'path';
import { exec } from '../utils';

export const updateVersion = (config: any, version: string) => {
  console.log(`Update project/package version ${config.name}`.blue);
  const [, versionId] = version.split('=');
  const path = normalize(config.rootDir);
  const newVersion = exec(`cd ${path} && npm version ${versionId}`);
  exec(`cd ${path} && git reset --hard HEAD`);
  return newVersion.replace('\n', '');
};
