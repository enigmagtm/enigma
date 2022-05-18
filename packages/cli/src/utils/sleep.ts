import { log } from './log';

export const sleep = async (ms: number, msg?: string): Promise<void> => {
  if (msg) log(msg);
  return new Promise((resolve: Function) => setTimeout(resolve, ms));
};
