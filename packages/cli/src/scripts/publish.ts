import { generateBuild } from './build';

export const publishPackages = (config: any, ...args: string[]) => {
  console.log('Publish to package manager');
  generateBuild(config, ...args);
};
