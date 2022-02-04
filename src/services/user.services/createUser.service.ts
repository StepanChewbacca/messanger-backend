import { hash } from '../bcrypt';
import { userRepository } from '../../repository/user.repository';
import { generateToken } from '../jwt';
import { sendMail } from '../sendMail';
import { IUser } from '../../interface/userInterfaces';
import { IError, ILinkInEmail, IServiceResult } from '../../interface/error';

export const createUser = async (value: IUser): Promise<IServiceResult<ILinkInEmail, IError>> => {
  value.password = await hash(value.password);

  const user = await userRepository.createUser(value);

  if (!user) return { error: { data: 'InternalError', status: 500 } };

  const token = generateToken(user.id);
  const linkInEmail = await sendMail(user.email, token);

  if (!linkInEmail) return { error: { data: 'Email wan not send', status: 400 } };

  return { result: { linkInEmail } };
};
