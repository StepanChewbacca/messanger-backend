import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm/globals';
import dotenv from 'dotenv';
import { router } from './src/router/router';
import { IError } from './src/interface/error';
import cors from 'cors';
import * as fs from 'fs';
import { ConfigService } from './src/config/config';

dotenv.config();

createConnection().then(async () => {
  const app = express();

  app.use(cors())

  app.use(express.json());

  app.use('/api', router);

  app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status);
    res.send(error);
  });

  app.listen(process.env.PORT, () => {
    console.log(`App listen port: ${(process.env.PORT)}`);
  });
});
