import { getRepository, InsertResult, Repository } from 'typeorm';
import { IError, IServiceResult, IUserRepositoryResult } from '../interface/error';
import { MessageEntity } from '../entity/message.entity';
import { UserEntity } from '../entity/user.entity';
import { ChatEntity } from '../entity/chat.entity';
import { sendErrorToTelegram } from '../services/telegramAPI.service';
import { IUser } from '../interface/userInterfaces';

export class MessageRepository {
    typeORMRepository: Repository<MessageEntity>;

    async create(value: any, user: UserEntity): Promise<IServiceResult<InsertResult, IError>> {
      try {
        this.typeORMRepository = getRepository(MessageEntity);
        const result = await this.typeORMRepository.createQueryBuilder('message')
          .insert()
          .into(MessageEntity)
          .values([
            {
              text: value.text,
              read: value.read,
              send_date: value.send_date,
              user,
              chat: value.chat_id,
            },
          ])
          .execute();

        return { result };
      } catch (error) {
        console.log(error);

        return { error };
      }
    }

    async getAllByChat(value: any): Promise<IServiceResult<MessageEntity[], Error>> {
      try {
        this.typeORMRepository = getRepository(MessageEntity);

        const result = await this.typeORMRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.user', 'user')
          .leftJoinAndSelect('message.chat', 'chat')
          .where(`chat.id = ${value.chat_id}`)
          .offset((value.page - 1) * value.perPage)
          .limit(value.perPage)
          .getMany();

        return { result };
      } catch (error) {
        console.error(error);
        await sendErrorToTelegram(error);

        return { error };
      }
    }
}

export const messageRepository = new MessageRepository();
