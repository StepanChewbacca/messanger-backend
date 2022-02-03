import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm/globals';
import dotenv from 'dotenv';
import { router } from './src/router/router';
import { IError } from './src/Interface/Error';

dotenv.config();

createConnection().then(async () => {
  const app = express();

  app.use(express.json());

  app.use('/', router);

  app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status);
    res.send(error);
  });

  app.listen(process.env.PORT, () => {
    console.log(`App listen port: ${(process.env.PORT)}`);
  });
});
