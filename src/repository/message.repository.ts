import { getRepository, Repository } from 'typeorm';
import { IError, IServiceResult } from '../interface/returns.interface';
import { MessageEntity } from '../entity/message.entity';
import { UserEntity } from '../entity/user.entity';
import { sendErrorToTelegram } from '../services/telegramAPI.service';
import { ICreateMessage, IGetMessages } from '../interface/message.interface';
import { ChatEntity } from '../entity/chat.entity';

export class MessageRepository {
    typeORMRepository: Repository<MessageEntity>;

    async create(value: ICreateMessage, user: UserEntity): Promise<IServiceResult<ICreateMessage, IError>> {
      try {
        this.typeORMRepository = getRepository(MessageEntity);
        await this.typeORMRepository.createQueryBuilder('message')
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

        return { result: value };
      } catch (error) {
        console.log(error);

        return { error };
      }
    }

    async getAllByChat(value: IGetMessages): Promise<IServiceResult<MessageEntity[], Error>> {
      try {
        this.typeORMRepository = getRepository(MessageEntity);

        const result = await this.typeORMRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.user', 'user')
          .leftJoinAndSelect('message.chat', 'chat')
          .where(`chat.id = ${value.chat_id}`)
          .offset((value.page - 1) * value.perPage)
          .limit(value.perPage)
          .orderBy('message.send_date', 'ASC')
          .getMany();

        return { result };
      } catch (error) {
        console.error(error);
        await sendErrorToTelegram(error);

        return { error };
      }
    }

    async getLastMessageInRoom(room: ChatEntity): Promise<IServiceResult<MessageEntity | ChatEntity, IError>> {
      try {
        this.typeORMRepository = getRepository(MessageEntity);
        const result = await this.typeORMRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.room', 'room')
          .where(`room.id = ${room.id}`)
          .orderBy('message.send_date', 'DESC')
          .getMany();

        if (!result[0]) {
          return { result: room };
        }

        return { result: result[0] };
      } catch (error) {
        return { error };
      }
    }
}

export const messageRepository = new MessageRepository();
