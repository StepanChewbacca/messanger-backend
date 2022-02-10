import { routes } from './routes';

export const mailerText = {
  FORGOT_PASSWORD_TEXT: 'Hi! If you want to reset your password, click on this link',
  SIGN_UP_TEXT: 'Hi! please confirm your email, click on this link',
};



export const mailerRoutes = {
  [routes.CONFIRM_EMAIL]: mailerText.SIGN_UP_TEXT,
  [routes.FORGOT_PASSWORD]: mailerText.FORGOT_PASSWORD_TEXT,
};