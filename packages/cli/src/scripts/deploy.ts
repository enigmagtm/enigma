#!/usr/bin/env node
import fs from 'fs';
import { normalize } from 'path';
import { execute } from './execute';
import { updateVersion } from './version';

export const deploy = (command: string, file: string, ...args: string[]): void => {
  if (!command) {
    console.log('Command not defined.'.red);
    process.exit();
  }

  const [execCommand, projectNameCommand] = command.split(':');
  if (!file || !fs.existsSync(normalize(file))) {
    console.log('Deploy file not found.'.red);
    process.exit();
  }

  let version = args.find((arg: string) => new RegExp(/(-v=).+\w/g).test(arg)) || '-v=patch';
  args.splice(args.indexOf(version), 1);

  let config: any;
  try {
    config = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e: any) {
    console.log(`Not a valid json configuration ${e.message}`.red);
  }

  const updateMainVersion = (): void => {
    switch (execCommand) {
      case 'publish':
      case 'p':
        version = `-v=${updateVersion(config, version).replace('v', '')}`;
        break;
    }
  };

  if (projectNameCommand) {
    const project = config.projects[projectNameCommand];
    if (!project) {
      console.log(`Project with name ${projectNameCommand} not found.`.red);
      process.exit();
    }

    updateMainVersion();

    execute(execCommand, project, version, ...args);
    process.exit();
  }

  updateMainVersion();

  for (const projectName of Object.keys(config.projects)) {
    execute(execCommand, config.projects[projectName], version, ...args);
  }
};
