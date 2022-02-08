import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { routes } from '../constants/routes';

export const router = Router();

router.use('/user', router)
  .post(routes.SIGN_UP, userController.createUser)
  .get(routes.CONFIRM_EMAIL, userController.confirmEmail.bind(userController))
  .post(routes.ACCEPT_INVITATION, userController.addInfoUser.bind(userController))
  .post(routes.SIGN_IN, userController.signIn.bind(userController))
  .post(routes.FORGOT_PASSWORD, userController.forgotPassword.bind(userController))
  .get(routes.FORGOT_PASSWORD, userController.confirmChangePassword.bind(userController))
  .post(routes.CHANGE_PASSWORD, userController.changePassword.bind(userController));
