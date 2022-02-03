import { NextFunction, Request, Response } from 'express';
import { additionalInfoValidation } from '../middlewares/validation/user.validator';
import { checkValidToken, getUserIdFromToken } from '../services/checkToken';
import { user } from '../repository/user.repository';

export const additionalInfoController = async (req: Request, res: Response, next: NextFunction) => {

};
