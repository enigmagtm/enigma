import fs from 'fs';
import { debugLog, log } from '../utils';

export interface DeployConfiguration {
  name: string;
  rootDir: string;
  tsconfig: string;
  projects: any;
  dependencies?: string[];
}

export const loadDeployConfig = (): DeployConfiguration => {
  try {
    if (!fs.existsSync('deploy.json')) {
      log('Deploy configuration file not found on root directory.'.red)
      process.exit();
    }

    debugLog('Loading deploy configuration');
    return JSON.parse(fs.readFileSync('./deploy.json', 'utf8'));
  } catch (e: any) {
    log(`Not a valid json configuration ${e.message}`.red);
    process.exit();
  }
}