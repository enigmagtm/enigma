import { program } from 'commander';
import fs from 'fs';
import { loadDeployConfig } from '../scripts';
import { exec, log } from '../utils';

export const createTagsCommand = (): void => {
  program
    .command('tags [name]')
    .action(generateTags);
};

const generateTags = (name: string): void => {
  const config = loadDeployConfig();
  const projects = Object.keys(config.projects).filter((projectName: any): boolean => !name || projectName === name);
  const cwd = process.cwd();
  try {
    for (const project of projects) {
      const configProject = config.projects[project];
      process.chdir(configProject.rootDir);
      generateTag(configProject);
    }
  } finally {
    process.chdir(cwd);
  }
};

const generateTag = (config: any) => {
  log(`Create tag and update project/package ${config.name}`.blue);
  const file = 'package.json';
  if (!fs.existsSync(file)) {
    log(`Package configuration file not found. [${file}].`.red);
    process.exit();
  }

  const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
  exec(`git tag v${packageJson.version}`);
  exec(`git push --tags`);
};
