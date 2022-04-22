import fs from 'fs';

const tsconfig = {
  compilerOptions: {
    module: "commonjs",
    esModuleInterop: true,
    target: "es2021",
    moduleResolution: "node",
    sourceMap: true,
    outDir: "dist",
    strict: true,
    strictPropertyInitialization: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    useUnknownInCatchVariables: false,
    baseUrl: "./src",
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    skipLibCheck: true,
    resolveJsonModule: true
  },
  lib: [
    "es2021",
    "dom"
  ]
};

export const createTsconfigJson = (): void => {
  const filename = 'tsconfig.json';
  fs.writeFileSync(filename, JSON.stringify(tsconfig, null, 2));
};
