import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { additionalInfoController } from '../controller/additionalInfoController';

export const router = Router();

router.post('/sign-up', userController.createUser);
router.get('/confirm-email', userController.confirmEmail);
router.post('/accept-invitation', userController.addInfoUser);
