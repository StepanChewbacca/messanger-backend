import { constants as httpConstants } from 'http2';
import { hash, compare } from '../bcrypt';
import { userRepository } from '../../repository/user.repository';
import { generateToken } from '../jwt';
import { sendMail } from '../sendMail';
import { IUpdateResultUser, IUser } from '../../interface/userInterfaces';
import { IError, IServiceResult } from '../../interface/error';
import { ILinkInEmail } from '../../interface/mail.interface';
import { IToken } from '../../interface/token.interface';
import { routes } from '../../constants/routes';
import { getUserEmailFromToken } from '../checkToken';
import { EmailSubjectEnum, EmailTextEnum } from '../../constants/mailer';
import { hosts } from '../../constants/host';
import { ConfigService } from '../../config/config';

class UserServices {
  async createUser(value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> {
    value.password = await hash(value.password);

    const {user, error} = await userRepository.createUser(value);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const token = generateToken(user.email, ConfigService.getCustomKey('JWT_SIGN_UP_KEY'));
    const linkForEmail = `${hosts.HTTP}${hosts.HOST}${routes.USER}${routes.CONFIRM_EMAIL}?token=${token}`;
    const linkInEmail = await sendMail({
      email: user.email,
      link: linkForEmail,
      text: EmailTextEnum.CONFIRM_EMAIL,
      subject: EmailSubjectEnum.CONFIRM_EMAIL,
    });

    if (!linkInEmail) return { error: { data: 'Email was not send', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result: { linkForEmail } };
  }

  async signIn(value: IUser): Promise<IServiceResult<IToken, IError>> {
    const {user,  error} = await userRepository.getUserByEmail(value.email);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } }

    const password = await compare(value.password, user.password);

    if (!user.activated_at || !password) {
      return {
        error: {
          data: 'Invalid User',
          status: httpConstants.HTTP_STATUS_BAD_REQUEST,
        },
      };
    }

    const token = generateToken(user.email, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));


    return { result: { token } };
  }

  async addInfoUser(value: IUser, token: string): Promise<IServiceResult<IUpdateResultUser, IError>> {
    const userEmail = await getUserEmailFromToken(token, ConfigService.getCustomKey('JWT_SIGN_UP_KEY'));

    if (!userEmail) return { error: { data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const {user, error} = await userRepository.addInfoUser(value, userEmail);

    if (!user) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result: { user } };
  }

  async forgotPassword(value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> {
    const { user, error } = await userRepository.getUserByEmail(value.email);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } }

    if (!user.activated_at) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const token = generateToken(user.email, ConfigService.getCustomKey('JWT_FORGOT_PASSWORD_KEY'));

    const linkForEmail = `${hosts.HTTP}${hosts.HOST}${routes.USER}${routes.FORGOT_PASSWORD}?token=${token}`;

    const linkInEmail = await sendMail({
      email: user.email,
      link: linkForEmail,
      text: EmailTextEnum.FORGOT_PASSWORD,
      subject: EmailSubjectEnum.FORGOT_PASSWORD,
    });

    return { result: { linkForEmail } };
  }

  async changePassword(value: IUser, token: string): Promise<IServiceResult<IUpdateResultUser, IError>> {
    value.password = await hash(value.password);
    const userEmail = await getUserEmailFromToken(token as string, ConfigService.getCustomKey('JWT_FORGOT_PASSWORD_KEY'));
    const { user, error } = await userRepository.changePassword(value.password, userEmail);

    if (!user) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result: { user } };
  }
}

export const userServices = new UserServices();
