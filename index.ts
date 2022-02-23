import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm/globals';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';
import { router } from './src/router/router';
import { IError } from './src/interface/returns.interface';
import { ConfigService } from './src/config/config';
import { routes } from './src/constants/routes';

createConnection().then(async () => {
  const app = express();

  const server = http.createServer(app);

  const io = new Server(server);

  global.io = io;

  app.use(cors());

  app.use(express.json());

  app.use(routes.API, router);

  app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status);
    res.send(error);
  });

  io.on('connection', () => {
    console.log('a user connected');
  });

  server.listen(ConfigService.getCustomKey('PORT'), () => {
    console.log(`App listen port: ${ConfigService.getCustomKey('PORT')}`);
  });
});
