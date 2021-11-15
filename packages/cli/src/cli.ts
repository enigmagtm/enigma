#!/usr/bin/env node
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
        const directories = normalize(args[0]);
        createControllerResource(directories, args[1], args[2]);
        break;
      default: console.log('Command type not recognized');
    }
    break;
  default: console.log('Command not recognized');
}
