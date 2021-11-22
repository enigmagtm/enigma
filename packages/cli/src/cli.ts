#!/usr/bin/env node
import { createModule } from './module';
import { normalize } from 'path';
import { createControllerResource } from './controller';
import { createApp } from './create';

const [, , command, type, ...args] = process.argv;
switch (command) {
  case 'new':
    if (!type) {
      console.log('Must provide name for app');
      process.exit();
    }

    createApp(type, ...args);
    break;
  case 'g':
    switch (type) {
      case 'c':
        const folderPathController = normalize(args[0]);
        createControllerResource(folderPathController, args[1], args[2]);
        break;
      case 'm':
        const folderPathModule = normalize(args[0]);
        createModule(folderPathModule, args[1]);
        break;
      default: console.log('Command type not recognized');
    }
    break;
  default: console.log('Command not recognized');
}
