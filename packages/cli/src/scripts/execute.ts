import { generateBuild } from './build';
import { installPackages } from './install';
import { publishPackage } from './publish';
import { generateTags } from './tag';
import { updateVersion } from './version';

export const execute = (execCommand: string, configuration: any, version: string, ...args: string[]) => {
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
      updateVersion(configuration, version);
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