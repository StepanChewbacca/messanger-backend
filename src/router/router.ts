import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { routes } from '../constants/routes';
import { chatController } from '../controller/chat.controller';
import { messageController } from '../controller/message.controller';

export const router = Router();

router.use(routes.USER, router)
  .post(routes.SIGN_UP, userController.createUser)
  .get(routes.CONFIRM_EMAIL, userController.confirmEmail)
  .post(routes.ACCEPT_INVITATION, userController.addInfoUser)
  .post(routes.SIGN_IN, userController.signIn)
  .post(routes.FORGOT_PASSWORD, userController.forgotPassword)
  .get(routes.FORGOT_PASSWORD, userController.confirmChangePassword)
  .post(routes.CHANGE_PASSWORD, userController.changePassword);

router.use(routes.CHAT, router)
  .post(routes.ADD_USER_TO_CHAT, chatController.addUserToChat)
  .post(routes.CREATE_CHAT, chatController.createChat);

router.use(routes.MESSAGES, router)
  .post(routes.CREATE_MESSAGE, messageController.create)
  .get(routes.GET_MESSAGES, messageController.get);
