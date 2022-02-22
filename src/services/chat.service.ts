import { constants as httpConstants } from 'http2';
import { chatRepository } from '../repository/chat.repository';
import { IError, IServiceResult } from '../interface/error';
import { IChat, IUserIdChatId } from '../interface/chat.interface';
import { ConfigService } from '../config/config';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { IUser } from '../interface/userInterfaces';

class ChatServices {
  async addUserToChat(value: IUserIdChatId): Promise<IServiceResult<void, IError>> {
    const { result, error } = await chatRepository.addUserToChat(value.chat_id, value.user_id);

    if (error) return { error: { data: error.data, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }

  async createChat(value: any, headers): Promise<IServiceResult<void, IError>> {
    const { result: DBResult, error: DBError } = await chatRepository.createRoom(value);

    if (DBError) return { error: { data: DBError.data, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const { result: decodeInfo, error: decodeError } = await decodeToken<IUser>(headers.token, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    const { result, error } = await chatRepository.addUserToChat(DBResult.id, user.id);

    if (error) return { error: { data: error.data, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }
}

export const chatServices = new ChatServices();
