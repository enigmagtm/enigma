import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';


export const exec = (cmd: string, options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf8' }): string => {
  return execSync(cmd, options).replaceAll('\n', '');
};