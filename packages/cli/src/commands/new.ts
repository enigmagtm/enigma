import { program } from 'commander';
import { createApp } from '../create';

export const createNewCommand = (): void => {
  program
    .command('new <name>')
    .requiredOption('-db --database <database>')
    .option('-skipi --skip-install', 'Skip installation of packages')
    .option('-skipg --skip-git', 'Skip git initialization')
    .option('-skipc --skip-commit', 'Skip initial commit')
    .action(createApp);
};
