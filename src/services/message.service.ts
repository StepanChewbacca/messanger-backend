import { constants as httpConstants } from 'http2';
import { IError, IServiceResult } from '../interface/returns.interface';
import { ConfigService } from '../config/config';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { IUser } from '../interface/user.interfaces';
import { messageRepository } from '../repository/message.repository';
import { MessageEntity } from '../entity/message.entity';
import { chatRepository } from '../repository/chat.repository';
import { ICreateMessage, IGetMessages } from '../interface/message.interface';

class MessageServices {
  async create(value: ICreateMessage, headers): Promise<IServiceResult<ICreateMessage, IError>> {
    const { result: decodeInfo, error: decodeError }
        = await decodeToken<IUser>(headers.token, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (userError) return { error: { data: userError.name, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { result, error } = await messageRepository.create(value, user);

    if (error) return { error: { data: 'Database error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    result.user = user;

    return { result };
  }

  async get(value: IGetMessages, headers): Promise<IServiceResult<MessageEntity[], IError>> {
    const { result: decodeInfo, error: decodeError }
        = await decodeToken<IUser>(headers.token, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (!user) return { error: { data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    if (userError) return { error: { data: userError.name, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { result: chat, error: chatError } = await chatRepository.getUserInChat(user.id, value.chat_id);

    if (chatError) return { error: { data: 'Not Found', status: httpConstants.HTTP_STATUS_NOT_FOUND } };

    if (!chat) return { error: { data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { result, error } = await messageRepository.getAllByChat(value);

    if (error) return { error: { data: 'Database error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }
}

export const messageServices = new MessageServices();
