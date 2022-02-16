import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { routes } from '../constants/routes';

export const router = Router();

router.use(routes.USER, router)
  .post(routes.SIGN_UP, userController.createUser)
  .get(routes.CONFIRM_EMAIL, userController.confirmEmail)
  .post(routes.ACCEPT_INVITATION, userController.addInfoUser)
  .post(routes.SIGN_IN, userController.signIn)
  .post(routes.FORGOT_PASSWORD, userController.forgotPassword)
  .get(routes.FORGOT_PASSWORD, userController.confirmChangePassword)
  .post(routes.CHANGE_PASSWORD, userController.changePassword);
