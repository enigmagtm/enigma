import { normalize } from 'path';
import { exec } from '../utils';

export const updateVersion = (config: any, ...args: string[]) => {
  console.log(`Update project/package version ${config.name}`.blue);
  const releaseVersion = args.find((arg: string) => new RegExp(/(-v=).+\w/g).test(arg)) || '-v=patch';
  const [, versionId] = releaseVersion.split('=');
  const path = normalize(config.rootDir);
  const newVersion = exec(`cd ${path} && npm version ${versionId}`);
  exec(`cd ${path} && git reset --hard HEAD`);
  return newVersion.replace('\n', '');
};
