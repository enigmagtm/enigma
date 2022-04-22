import { program } from 'commander';

export const main = {
  get verbose(): boolean {
    return program.getOptionValue('verbose');
  }
}