import { NextFunction, Request, Response } from 'express';
import { constants as httpConstants } from 'http2';
import { chatIdValidation, messageValidation } from '../middlewares/validation/message.validator';
import { messageServices } from '../services/message.service';

class MessageController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = messageValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await messageServices.create(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    global.io.emit('get message', { result });

    res.status(httpConstants.HTTP_STATUS_CREATED).send(result);
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = chatIdValidation.validate(req.query, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await messageServices.get(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }
}

export const messageController = new MessageController();
