#!/usr/bin/env node
import { createControllerResource } from './controller';
const [, , command, type, ...args] = process.argv;
console.log(__dirname);
switch (command) {
  case 'g':
    switch (type) {
      case 'c':
        createControllerResource(args[0], args[1], args[2]);
        break;
      default: console.log('Command type not recognized');
    }
    break;
  default: console.log('Command not recognized');
}
