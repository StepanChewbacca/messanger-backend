import { getRepository, Repository } from 'typeorm';
import { IError, IServiceResult } from '../interface/returns.interface';
import { sendErrorToTelegram } from '../services/telegramAPI.service';
import { ChatEntity } from '../entity/chat.entity';
import { IChat, IChatQuery, IReturnResultArrayAndCount } from '../interface/chat.interface';
import { IUser } from '../interface/user.interfaces';

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

    async get(query: IChatQuery, user: IUser): Promise<IServiceResult<IReturnResultArrayAndCount, Error>> {
      try {
        this.typeORMRepository = getRepository(ChatEntity);
        const result = await this.typeORMRepository
          .createQueryBuilder('room')
          .leftJoin('room.users', 'users')
          .where(`users.id = ${user.id}`)
          .andWhere('room.name like :name', { name: `%${query.name}%` })
          .offset((query.page - 1) * query.perPage)
          .limit(query.perPage)
          .getMany();

        return { result: { data: result, count: result.length } };
      } catch (error) {
        return { error };
      }
    }
}

export const chatRepository = new ChatRepository();
