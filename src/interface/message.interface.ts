import { UserEntity } from '../entity/user.entity';
import { ChatEntity } from '../entity/chat.entity';

export interface IMessage {
    id: number,
    text: string,
    send_date: Date,
    read: boolean,
    user: UserEntity,
    chat: ChatEntity
}

export interface ICreateMessage {
    text: string,
    send_date: Date,
    read: boolean,
    user: UserEntity,
    chat_id: ChatEntity
}

export interface IGetMessages {
    chat_id: number
    page: number;
    perPage: number;
}
