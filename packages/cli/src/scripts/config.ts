import { red } from 'colors';
import fs from 'fs';
import { join, normalize } from 'path';
import { debugLog, log } from '../utils';

export interface DeployConfiguration {
  name: string;
  rootDir: string;
  tsconfig: string;
  projects?: any;
  dependencies?: string[];
}

let config: DeployConfiguration;

export const mapProjectDependencies = (dependencies: string[]) => {
  return dependencies?.map((name: string) => {
    const project = loadProjectConfig(name);
    return project.name;
  }) || [];
};

export const loadProjectConfig = (name: string): DeployConfiguration => {
  const project = config?.projects[name];
  if (!project) {
    log(`Project ${name} not found in configuration projects`, red);
    process.exit();
  }

  return project;
};

export const loadDeployConfig = (): DeployConfiguration => {
  try {
    if (config) return config;
    if (!fs.existsSync('deploy.json')) {
      log('Deploy configuration file not found on root directory.'.red)
      process.exit();
    }

    debugLog('Loading deploy configuration');
    config = JSON.parse(fs.readFileSync('deploy.json', 'utf8'));
    config.rootDir = normalize(process.cwd());
    const projects = Object.keys(config?.projects || {});
    for (const key of projects) {
      const project = config.projects[key];
      project.rootDir = normalize(join(process.cwd(), project.rootDir));
    }
    return config;
  } catch (e: any) {
    log(`Not a valid json configuration ${e.message}`.red);
    process.exit();
  }
}