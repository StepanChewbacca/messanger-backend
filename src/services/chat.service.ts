import { constants as httpConstants } from 'http2';
import { IncomingHttpHeaders } from 'http';
import { chatRepository } from '../repository/chat.repository';
import { IError, IReturnResultWithCount, IServiceResult } from '../interface/returns.interface';
import { IChat, IChatQuery, IUserIdChatId } from '../interface/chat.interface';
import { ConfigService } from '../config/config';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { IUser } from '../interface/user.interfaces';
import { messageRepository } from '../repository/message.repository';
import { ChatEntity } from '../entity/chat.entity';

class ChatServices {
  async addUserToChat(value: IUserIdChatId): Promise<IServiceResult<void, IError>> {
    const { result, error } = await chatRepository.addUserToChat(value.chat_id, value.user_id);

    if (error) return { error: { data: error.data, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }

  async createChat(value: IChat, headers): Promise<IServiceResult<void, IError>> {
    const { result: DBResult, error: DBError } = await chatRepository.createRoom(value);

    if (DBError) return { error: { data: DBError.data, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    const { result: decodeInfo, error: decodeError }
        = await decodeToken<IUser>(headers.token, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (userError) return { error: { data: userError.message, status: httpConstants.HTTP_STATUS_BAD_REQUEST } };

    const { result, error } = await chatRepository.addUserToChat(DBResult.id, user.id);

    if (error) return { error: { data: error.data, status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR } };

    return { result };
  }

  async get(query: IChatQuery, headers: IncomingHttpHeaders): Promise<IServiceResult<IReturnResultWithCount, IError>> {
    const { result: decodeInfo, error: decodeError }
        = await decodeToken<IUser>(headers.token as string, ConfigService.getCustomKey('JWT_SIGN_IN_KEY'));

    if (decodeError) return { error: { data: decodeError.message, status: 500 } };

    const { result, error } = await chatRepository.get(query, decodeInfo);

    const data = await Promise.all(result.data.map((item: ChatEntity) => messageRepository.getLastMessageInRoom(item)));

    if (error) return { error: { data: error.message, status: 500 } };

    return { result: { data, count: result.count, status: 200 } };
  }
}

export const chatServices = new ChatServices();
