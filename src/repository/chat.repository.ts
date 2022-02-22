import { getRepository, Repository, UpdateResult } from 'typeorm';
import { IError, IServiceResult } from '../interface/error';
import { sendErrorToTelegram } from '../services/telegramAPI.service';
import { ChatEntity } from '../entity/chat.entity';
import { IChat } from '../interface/chat.interface';

export class ChatRepository {
    typeORMRepository: Repository<ChatEntity>;

    async addUserToChat(chat_id: number, user_id: number): Promise<IServiceResult<void, IError>> {
      try {
        const result = await this.typeORMRepository
          .createQueryBuilder('chats')
          .relation(ChatEntity, 'users')
          .of(chat_id)
          .add(user_id);

        return { result };
      } catch (error) {
        await sendErrorToTelegram(error);

        return { error };
      }
    }

    async createRoom(value: IChat): Promise<IServiceResult<ChatEntity, IError>> {
      try {
        this.typeORMRepository = getRepository(ChatEntity);
        const room = this.typeORMRepository.create(value);
        const result = await this.typeORMRepository.save(room);

        return { result };
      } catch (error) {
        return { error };
      }
    }

    async getUserInChat(user_id: number, chat_id: number): Promise<IServiceResult<ChatEntity, IError>> {
      try {
        this.typeORMRepository = getRepository(ChatEntity);
        const result = await this.typeORMRepository
          .createQueryBuilder('chat')
          .leftJoin('chat.users', 'users')
          .where(`users.id = ${user_id} and chat.id = ${chat_id}`)
          .getOne();

        return { result };
      } catch (error) {
        await sendErrorToTelegram(error);

        return { error };
      }
    }
}

export const chatRepository = new ChatRepository();
