#!/usr/bin/env node
import 'colors';
import { program } from 'commander';
import {
  createBuildCommand, createGenerateCommand, createInstallCommand, createNewCommand, createPublishCommand,
  createTagsCommand, createVersionCommand
} from './scripts';

program
  .option('-vb --verbose', 'Show commands and steps been executed.');

createNewCommand();
createBuildCommand();
createInstallCommand();
createPublishCommand();
createTagsCommand();
createVersionCommand();
createGenerateCommand();

program.parse(process.argv);
