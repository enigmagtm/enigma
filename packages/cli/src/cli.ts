#!/usr/bin/env node
import 'colors';
import { normalize } from 'path';
import { createControllerResource } from './controller';
import { createApp } from './create';
import { createModule } from './module';
import { deploy } from './scripts';

const [, , command, option, ...args] = process.argv;
switch (command) {
  case 'new':
    if (!option) {
      console.log('Must provide name for app');
      process.exit();
    }

    createApp(option, ...args);
    break;

  case 'd':
  case 'deploy':
    const [file, ...argsDeploy] = args;
    deploy(option, file, ...argsDeploy);
    break;

  case 'g':
  case 'generate':
    switch (option) {
      case 'c':
      case 'controller':
        const folderPathController = normalize(args[0]);
        createControllerResource(folderPathController, args[1], args[2]);
        break;
      case 'm':
      case 'module':
        const folderPathModule = normalize(args[0]);
        createModule(folderPathModule, args[1]);
        break;
      default: console.log('Command type not recognized');
    }
    break;
  default: console.log('Command not recognized');
}
