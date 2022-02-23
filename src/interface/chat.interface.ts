import { ChatEntity } from '../entity/chat.entity';
import { UserEntity } from '../entity/user.entity';

export interface IChat {
    id: number;
    name: string;
}

export interface IUserIdChatId {
    user_id: number;
    chat_id: number;
}

export interface IReturnResultArrayAndCount {
    data: ChatEntity[];
    count: number;
}

export interface IChatQuery {
    name: string;
    users: UserEntity[];
    page?: number;
    perPage?: number;
}
