#!/usr/bin/env node
import 'colors';
import { program } from 'commander';
import {
  createBuildCommand, createGenerateCommand, createInstallCommand, createNewCommand, createPublishCommand,
  createTagsCommand, createUglifyCommand, createVersionCommand
} from './commands';

program
  .option('-vb --verbose', 'Show commands and steps been executed.');

createBuildCommand();
createGenerateCommand();
createInstallCommand();
createNewCommand();
createPublishCommand();
createTagsCommand();
createUglifyCommand();
createVersionCommand();

program.parse(process.argv);
