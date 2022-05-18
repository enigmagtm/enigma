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

export const mapProjectDependencies = (dependencies: string[] = []) => {
  return dependencies?.map((name: string) => {
    const project = loadProjectConfig(name);
    return project.name;
  }) || [];
};

export const loadProjectConfig = (name: string): DeployConfiguration => {
  const project = deployCfg()?.projects[name];
  if (!project) {
    log(`Project ${name} not found in configuration projects`, red);
    process.exit();
  }

  return project;
};

const rootDir = process.cwd();

const loadDeployConfig = (): DeployConfiguration => {
  try {
    const deployFile = join(rootDir, 'deploy.json');
    if (!fs.existsSync(deployFile)) {
      log('Deploy configuration file not found on root directory.'.red)
      process.exit();
    }

    debugLog('Loading deploy configuration');
    const cfg = JSON.parse(fs.readFileSync(deployFile, 'utf8'));
    cfg.rootDir = normalize(rootDir);
    const projects = Object.keys(cfg?.projects || {});
    for (const key of projects) {
      const project = cfg.projects[key];
      project.rootDir = normalize(join(rootDir, project.rootDir));
    }
    return cfg;
  } catch (e: any) {
    log(`Not a valid json configuration ${e.message}`.red);
    process.exit();
  }
}

export const deployCfg = loadDeployConfig;