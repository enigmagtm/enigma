import { program } from 'commander';
import fs from 'fs';
import { join, normalize } from 'path';
import { exec, log } from '../utils';
import { loadDeployConfig } from '../scripts/config';

export const createTagsCommand = (): void => {
  program
    .command('tags [name]')
    .action((name: string): void => {
      const config = loadDeployConfig();
      const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
      for (const project of projects) {
        generateTags(config.projects[project]);
      }
    });
};

const generateTags = (config: any) => {
  log(`Create tag and update project/package ${config.name}`.blue);
  const filename = 'package.json';
  const path = normalize(config.rootDir);
  const file = join(path, filename);
  if (!fs.existsSync(file)) {
    log(`Package configuration file not found. [${file}].`.red);
    process.exit();
  }

  const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
  exec(`cd ${path} && git tag v${packageJson.version} && git push --tags`);
};