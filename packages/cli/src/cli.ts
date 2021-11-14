#!/usr/bin/env node
import { normalize } from 'path';
import { createControllerResource } from './controller';
const [, , command, type, ...args] = process.argv;
switch (command) {
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
