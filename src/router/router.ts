import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { routes } from '../constants/routes';

export const router = Router();

router.post(routes.SIGN_UP, userController.createUser);
router.get(routes.CONFIRM_EMAIL, userController.confirmEmail);
router.post(routes.ACCEPT_INVITATION, userController.addInfoUser);
router.post(routes.SIGN_IN, userController.signIn);
router.post(routes.FORGOT_PASSWORD, userController.forgotPassword);
router.get(routes.FORGOT_PASSWORD, userController.confirmChangePassword);
router.post(routes.CHANGE_PASSWORD, userController.changePassword);
