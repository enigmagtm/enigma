#!/usr/bin/env node
import 'colors';
import { program } from 'commander';
import { main } from './main';
import {
  createBuildCommand, createGenerateCommand, createInstallCommand, createNewCommand, createPublishCommand,
  createTagsCommand, createVersionCommand
} from './scripts';

program
  .version(main.version)
  .option('-vb --verbose', 'Show commands and steps been executed.');

createNewCommand();
createBuildCommand();
createInstallCommand();
createPublishCommand();
createTagsCommand();
createVersionCommand();
createGenerateCommand();

program.parse(process.argv);
