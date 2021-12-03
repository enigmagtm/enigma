import { main } from '../main';

export const log = (message?: any, ...optionalParams: any[]): void => {
  console.log(message, ...optionalParams);
};

export const debugLog = (message?: any, ...optionalParams: any[]): void => {
  if (main.verbose) {
    console.log(message, ...optionalParams);
  }
};
