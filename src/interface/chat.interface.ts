import { UserEntity } from '../entity/user.entity';

export interface IChat {
    id: number;
    name: string;
    users: UserEntity[]
}

export interface IUserIdChatId {
    user_id: number;
    chat_id: number;
}
