import { constants as httpConstants } from 'http2';
import { hash, compare } from '../bcrypt.service';
import { userRepository } from '../../repository/user.repository';
import { generateToken } from '../jwt';
import { nodeMailer } from '../sendGrid.service';
import { IUpdateResultUser, IUser } from '../../interface/userInterfaces';
import { IError, IServiceResult } from '../../interface/error';
import { ILinkForEmail } from '../../interface/mail.interface';
import { IToken } from '../../interface/token.interface';
import { routes } from '../../constants/routes';
import { getUserEmailFromToken } from '../checkToken';
import { EmailSubjectEnum, EmailTextEnum } from '../../enums/sendGrid.enums';
import { hosts } from '../../constants/host';
import { ConfigService } from '../../config/config';

class UserServices {
  async createUser(value: IUser): Promise<IServiceResult<ILinkForEmail, IError>> {
    value.password = await hash(value.password);

    const { user, error } = await userRepository.createUser(value);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const token = generateToken(user.email, ConfigService.getCustomKey('JWT_SIGN_UP_KEY'));
    const linkForEmail = `${hosts.HTTP}${hosts.HOST}${routes.USER}${routes.CONFIRM_EMAIL}?token=${token}`;
    const { result, error: mailerError } = await nodeMailer.sendMail({
      email: user.email,
      link: linkForEmail,
      text: EmailTextEnum.CONFIRM_EMAIL,
      subject: EmailSubjectEnum.CONFIRM_EMAIL,
    });

    if (mailerError) return { error: { data: 'Email was not sent', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result };
  }

  async signIn(value: IUser): Promise<IServiceResult<IToken, IError>> {
    const { user, error } = await userRepository.getUserByEmail(value.email);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const { result: password, error: compareError } = await compare(value.password, user.password);

    if (compareError) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    if (!user.activated_at || !password) {
      return {
        error: {
          data: 'Invalid User',
          status: httpConstants.HTTP_STATUS_NOT_FOUND,
        },
      };
    }

    const token = generateToken(user.email, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    return { result: { token } };
  }

  async addInfoUser(value: IUser, token: string): Promise<IServiceResult<IUpdateResultUser, IError>> {
    const userEmail = await getUserEmailFromToken(token, ConfigService.getCustomKey('JWT_SIGN_UP_KEY'));

    if (!userEmail) return { error: { data: 'Invalid token', status: httpConstants.HTTP_STATUS_NOT_FOUND } };

    const { user, error } = await userRepository.addInfoUser(value, userEmail);

    if (!user) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_NOT_FOUND } };

    return { result: { user } };
  }

  async forgotPassword(value: IUser): Promise<IServiceResult<ILinkForEmail, IError>> {
    const { user, error } = await userRepository.getUserByEmail(value.email);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    if (!user.activated_at) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_NOT_FOUND } };

    const token = generateToken(user.email, ConfigService.getCustomKey('JWT_FORGOT_PASSWORD_KEY'));

    const linkForEmail = `${hosts.HTTP}${hosts.HOST}${routes.USER}${routes.FORGOT_PASSWORD}?token=${token}`;

    const { result, error: mailerError } = await nodeMailer.sendMail({
      email: user.email,
      link: linkForEmail,
      text: EmailTextEnum.FORGOT_PASSWORD,
      subject: EmailSubjectEnum.FORGOT_PASSWORD,
    });

    if (mailerError) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result };
  }

  async changePassword(value: IUser, token: string): Promise<IServiceResult<IUpdateResultUser, IError>> {
    value.password = await hash(value.password);
    const userEmail = await getUserEmailFromToken(token as string, ConfigService.getCustomKey('JWT_FORGOT_PASSWORD_KEY'));
    const { user, error } = await userRepository.changePassword(value.password, userEmail);

    if (error) return { error: { data: error.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    if (!user) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_NOT_FOUND } };

    return { result: { user } };
  }
}

export const userServices = new UserServices();
