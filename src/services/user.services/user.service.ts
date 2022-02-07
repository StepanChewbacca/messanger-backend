import { constants as httpConstants } from 'http2';
import { hash, compare } from '../bcrypt';
import { userRepository } from '../../repository/user.repository';
import { generateSignUpToken, generateSignInToken, generateForgotPasswordToken } from '../jwt';
import { sendMail } from '../sendMail';
import { IUser, IUserChangePassword } from '../../interface/userInterfaces';
import { IError, IServiceResult } from '../../interface/error';
import { ILinkInEmail } from '../../interface/mail.interface';
import { IToken } from '../../interface/token.interface';
import { routes } from '../../constants/routes';
import { getUserEmailFromToken } from '../checkToken';

const {
  JWT_FORGOT_PASSWORD_KEY,
} = process.env;

class UserServices {
  createUser = async (value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> => {
    value.password = await hash(value.password);

    const user = await userRepository.createUser(value);

    if (!user) return { error: { data: 'Internal Error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const token = generateSignUpToken(user.email);
    const linkInEmail = await sendMail(user.email, token, routes.CONFIRM_EMAIL);

    if (!linkInEmail) return { error: { data: 'Email was not send', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result: { linkInEmail } };
  };

  signIn = async (value: IUser): Promise<IServiceResult<IToken, IError>> => {
    const user = await userRepository.getUserByEmail(value.email);

    const password = await compare(value.password, user.password);

    console.log(password);

    console.log(user.activated_at);

    if (!user.activated_at || !password) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const token = generateSignInToken(user.email);

    return { result: { token } };
  };

  forgotPassword = async (value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> => {
    const user = await userRepository.getUserByEmail(value.email);

    if (!user.activated_at) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const token = generateForgotPasswordToken(user.email);

    const linkInEmail = await sendMail(user.email, token, routes.FORGOT_PASSWORD);

    return { result: { linkInEmail } };
  };

  changePassword = async (value: IUser, token: string | string[]): Promise<IServiceResult<IUserChangePassword, IError>> => {
    const userEmail = await getUserEmailFromToken(token as string, JWT_FORGOT_PASSWORD_KEY);
    const user = await userRepository.changePassword(value.password, userEmail);

    if (!user) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result: { user } };
  };
}

export const userServices = new UserServices();
