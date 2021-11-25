import { execSync } from 'child_process';

export const getPackageVersion = (packageName: string): string => {
  return `^${execSync(`npm show ${packageName} version`, { encoding: 'utf-8' }).replace('\n', '')}`;
};
