import { execSync } from 'child_process';
import { cyan } from 'colors';
import { normalize } from 'path';

export const updateVersion = (config: any, ...args: string[]) => {
  console.log(`Update project/package version ${config.name}`, cyan);
  const releaseVersion = args.find((arg: string) => new RegExp(/(-v=).+\w/g).test(arg)) || '-v=patch'
  const [, versionId] = (releaseVersion || '-v=patch').split('=');
  const path = normalize(config.rootDir);
  const newVersion = execSync(`cd ${path} && npm version ${versionId}`, { encoding: 'utf8' });
  if (config.updateVersion) {
    execSync(`cd ${path} && git commit -am ":bookmark: update to version ${newVersion}"`);
  }

  execSync(`cd ${path} && git reset --hard HEAD`);
  return newVersion;
};
