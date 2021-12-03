import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { debugLog } from './log';


export const exec = (cmd: string, options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf8' }): string => {
  debugLog(`Executing command [${cmd}].`.yellow);
  return execSync(cmd, options).replaceAll('\n', '');
};