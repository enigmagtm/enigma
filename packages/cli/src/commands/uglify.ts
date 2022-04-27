import { program } from 'commander';
import fs from 'fs';
import { join, normalize } from 'path';
import { buildCompilerOptions, deployCfg, DeployConfiguration } from '../scripts';
import { exec, log } from '../utils';

export interface MinifyOptions {
  compress: boolean;
}

export const createUglifyCommand = () => {
  program
    .command('uglify [name]').alias('u')
    .option('-c --compress', 'Compress all js files on dist', true)
    .action(uglifyPackages);
}

const getJsFiles = (dir: string): string[] => {
  return fs.readdirSync(dir).reduce((files: string[], name: string) => {
    const file = join(dir, name);
    const dirPath = fs.statSync(file);
    if (dirPath.isDirectory()) {
      files.push(...getJsFiles(file));
    }

    if (dirPath.isFile() && /.+\.js$/.test(name)) {
      files.push(file);
    }
    return files;
  }, []);
};

export const uglifyPackages = (name: string, options: MinifyOptions) => {
  const projects = Object.keys(deployCfg.projects).filter((projectName: any): boolean => !name || projectName === name);
  const cwd = process.cwd();
  try {
    for (const project of projects) {
      const configProject = deployCfg.projects[project];
      process.chdir(configProject.rootDir);
      uglifyPackage(configProject, options);
    }
  } finally {
    process.chdir(cwd);
  }
};

export const uglifyPackage = (config: DeployConfiguration, options: MinifyOptions) => {
  log(`Minifying project/package ${config.name}`.blue.bold);
  const compilerOptions = buildCompilerOptions(config.tsconfig);
  const jsFiles = getJsFiles(normalize(join(config.rootDir, compilerOptions.outDir)));
  jsFiles.forEach((filename: string) => {
    exec(`terser ${filename}${options.compress ? ' -c' : ''} -m -o ${filename}`);
  });
  log(`Minifying project/package ${config.name} complete`.green.bold);
}
