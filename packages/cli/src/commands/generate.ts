import { program } from 'commander';
import { createResourceController } from '../controller';
import { createModule } from '../module';

export const createGenerateCommand = (): void => {
  const command = program
    .command('generate').alias('g');
  command.command('module').alias('m')
    .argument('<path>', 'Path to generate module')
    .argument('[name]', 'Name for the module')
    .action(createModule)
  command.command('resource').alias('rc')
    .argument('<path>', 'Path to generate resource controller')
    .argument('<schema>', 'Schema for the resoruce controller model')
    .argument('[model]', 'Model or table name for the resource controller model')
    .option('-db --database [database]', 'Connect to database from ENV variable',)
    .action(createResourceController);
};
