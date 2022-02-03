import { NextFunction, Request, Response } from 'express';
import { queryTokenValidation } from '../middlewares/validation/user.validator';
import { checkValidToken } from '../services/checkToken';

export const confirmEmailController = async (req: Request, res: Response, next: NextFunction) => {

};
