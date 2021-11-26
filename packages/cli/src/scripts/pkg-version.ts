import { exec } from '../utils';

export const getPackageVersion = (packageName: string): string => {
  return `^${exec(`npm show ${packageName} version`).replace('\n', '')}`;
};
