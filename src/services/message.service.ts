import { constants as httpConstants } from 'http2';
import { InsertResult } from 'typeorm';
import { IError, IServiceResult } from '../interface/error';
import { ConfigService } from '../config/config';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { IUser } from '../interface/userInterfaces';
import { messageRepository } from '../repository/message.repository';
import { MessageEntity } from '../entity/message.entity';
import { chatRepository } from '../repository/chat.repository';

class MessageServices {
  async create(value: any, headers): Promise<IServiceResult<InsertResult, IError>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken<IUser>(headers.token, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (userError) return { error: { data: userError.name, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { result, error } = await messageRepository.create(value, user);

    if (error) return { error: { data: 'Database error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }

  async get(value: any, headers): Promise<IServiceResult<MessageEntity[], IError>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken<IUser>(headers.token, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (!user) return { error: { data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    if (userError) return { error: { data: userError.name, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { result: chat, error: chatError } = await chatRepository.getUserInChat(user.id, value.chat_id);

    if (!chat) return { error: { data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    console.log(chat, chatError);

    const { result, error } = await messageRepository.getAllByChat(value);

    if (error) return { error: { data: 'Database error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }
}

export const messageServices = new MessageServices();
