import { constants as httpConstants } from 'http2';
import { hash, compare } from '../bcrypt';
import { userRepository } from '../../repository/user.repository';
import { generateToken } from '../jwt';
import { sendMail } from '../sendMail';
import { IUser, IUserChangePassword } from '../../interface/userInterfaces';
import { IError, IServiceResult } from '../../interface/error';
import { ILinkInEmail } from '../../interface/mail.interface';
import { IToken } from '../../interface/token.interface';
import { routes } from '../../constants/routes';
import { getUserEmailFromToken } from '../checkToken';
import { EmailSubjectEnum, EmailTextEnum } from '../../constants/mailer';
import { hosts } from '../../constants/host';

const {
  JWT_SIGN_UP_KEY, JWT_SIGN_IN_KEY, JWT_FORGOT_PASSWORD_KEY,
} = process.env;

class UserServices {
  async createUser(value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> {
    value.password = await hash(value.password);

    const user = await userRepository.createUser(value);

    if (!user) return { error: { data: 'Internal Error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const token = generateToken(user.email, JWT_SIGN_UP_KEY);
    const linkForEmail = `${hosts.HTTP}${hosts.HOST}${routes.USER}${routes.CONFIRM_EMAIL}?token=${token}`;
    const linkInEmail = await sendMail({
      email: user.email,
      link: linkForEmail,
      text: EmailTextEnum.CONFIRM_EMAIL,
      subject: EmailSubjectEnum.CONFIRM_EMAIL,
    });

    if (!linkInEmail) return { error: { data: 'Email was not send', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result: { linkInEmail } };
  }

  async signIn(value: IUser): Promise<IServiceResult<IToken, IError>> {
    const user = await userRepository.getUserByEmail(value.email);

    const password = await compare(value.password, user.password);

    if (!user.activated_at || !password) {
      return {
        error: {
          data: 'Invalid User',
          status: httpConstants.HTTP_STATUS_BAD_REQUEST,
        },
      };
    }

    const token = generateToken(user.email, JWT_SIGN_IN_KEY);

    return { result: { token } };
  }

  async forgotPassword(value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> {
    const user = await userRepository.getUserByEmail(value.email);

    if (!user.activated_at) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const token = generateToken(user.email, JWT_FORGOT_PASSWORD_KEY);

    const linkForEmail = `${hosts.HTTP}${hosts.HOST}${routes.USER}${routes.FORGOT_PASSWORD}?token=${token}`;

    const linkInEmail = await sendMail({
      email: user.email,
      link: linkForEmail,
      text: EmailTextEnum.FORGOT_PASSWORD,
      subject: EmailSubjectEnum.FORGOT_PASSWORD,
    });

    return { result: { linkInEmail } };
  }

  async changePassword(value: IUser, token: string): Promise<IServiceResult<IUserChangePassword, IError>> {
    const userEmail = await getUserEmailFromToken(token as string, JWT_FORGOT_PASSWORD_KEY);
    const user = await userRepository.changePassword(value.password, userEmail);

    if (!user) return { error: { data: 'Invalid User', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    return { result: { user } };
  }
}

export const userServices = new UserServices();
