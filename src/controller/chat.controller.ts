import { NextFunction, Request, Response } from 'express';
import { constants as httpConstants } from 'http2';
import {chatNameValidation, userIdChatIdValidation} from '../middlewares/validation/chat.validation';
import { chatServices } from '../services/chat.service';

class ChatController {
  async addUserToChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = userIdChatIdValidation.validate(req.body, { abortEarly: false });

    if (error) {
      return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });
    }

    const { result, error: servicesError } = await chatServices.addUserToChat(value);

    if (servicesError) {
      return next({ data: servicesError.data, status: servicesError.status });
    }

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }

  async createChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = chatNameValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await chatServices.createChat(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    res.status(httpConstants.HTTP_STATUS_CREATED).send(result);
  }
}

export const chatController = new ChatController();
