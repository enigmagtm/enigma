#!/usr/bin/env node
import fs from 'fs';
import { normalize } from 'path';
import { generateBuild } from './build';
import { installPackages } from './install';
import { publishPackage } from './publish';
import { generateTags } from './tag';
import { updateVersion } from './version';

export const deploy = (command: string, file: string, ...args: string[]): void => {
  if (!command) {
    console.log('Command not defined.');
    process.exit();
  }

  const [execCommand, projectNameCommand] = command.split(':');
  if (!file || !fs.existsSync(normalize(file))) {
    console.log('Deploy file not found.');
    process.exit();
  }

  let config: any;
  try {
    config = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e: any) {
    console.log(`Not a valid json configuration ${e.message}`.red);
  }

  const execute = (configuration: any, version = '-v=patch') => {
    switch (execCommand) {
      case 'install':
      case 'i':
        // Install all pacakges in package.json
        installPackages(configuration, ...args);
        break;
      case 'build':
      case 'b':
        // build project to publish
        generateBuild(configuration);
        break;
      case 'version':
      case 'v':
        // Update version package
        updateVersion(configuration, ...args);
        break;
      case 'tag':
      case 't':
        // Create new tag and update remote tags
        generateTags(configuration, ...args);
        break;
      case 'publish':
      case 'p':
        // Publish package
        publishPackage(configuration, version, ...args);
        break;
      default: console.log('Command not recognized for scripts'.red);
    }
  };

  if (projectNameCommand) {
    const project = config.projects[projectNameCommand];
    if (!project) {
      console.log(`Project with name ${projectNameCommand} not found.`.red);
      process.exit();
    }

    let newVersion = 'patch';
    switch (execCommand) {
      case 'publish':
      case 'p':
        newVersion = updateVersion(config, ...args).replace('v', '');
        break;
    }

    execute(project, `-v=${newVersion}`);
    process.exit();
  }

  let newVersionAll = 'patch';
  switch (execCommand) {
    case 'publish':
    case 'p':
      newVersionAll = updateVersion(config, ...args).replace('v', '');
      break;
  }

  for (const projectName of Object.keys(config.projects)) {
    execute(config.projects[projectName], `-v=${newVersionAll}`);
  }
};
