import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';


export const exec = (cmd: string, options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf8' }): string => {
  console.log(`Executing command [${cmd}].`.bgMagenta.cyan.bold);
  return execSync(cmd, options).replaceAll('\n', '');
};