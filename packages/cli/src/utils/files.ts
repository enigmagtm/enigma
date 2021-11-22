export const readmeFile =
  `# Web Server for {0}

Web server for {0} with expressjs`;

export const entryFile = `import { enigmaServer } from '@enigmagtm/core';
import { routerLog } from '@enigmagtm/rsc';
import { AppModule } from './app/app.module';
import './config/connection';

try {
  const portServer = parseInt(process.argv[2] || process.env.ENIGMA_PORT || '4300', 10);
  enigmaServer.bootstrap(AppModule, { port: portServer, poweredBy: false, runServer: true });
  routerLog.display();
} catch (e) {
  console.log(e);
}
`;

export const appModuleFile = `import { Module } from '@enigmagtm/core';
import { ErrorHandler, ParseRequest } from '@enigmagtm/http';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import '../config/connection';

@Module({
  middlewares: [
    helmet(),
    cors(),
    compression(),
    express.json({ limit: '5mb', strict: false }),
    express.urlencoded({ limit: '5mb', extended: true }),
    ParseRequest
  ],
  errorMiddlewares: [
    ErrorHandler
  ],
  imports: []
})
export class AppModule {
}
`;

export const connectionFile =
  `import { Config, initializeConnection } from '@enigmagtm/orm';

const db = process.env.ENIGMA_DB || '';
const { client, version, connection, pool } = JSON.parse(db);
const config: Config = {
  client,
  version,
  connection,
  pool: {
    min: pool?.min || 1,
    max: pool?.max || 50
  }
};

initializeConnection(config);
`;

export const dotGitignoreFile =
  `node_modules
.vs
.idea
.settings
.project
.vscode
dist
`;