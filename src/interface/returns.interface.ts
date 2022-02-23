import { ChatEntity } from '../entity/chat.entity';
import { MessageEntity } from '../entity/message.entity';

export interface IError {
        data: string;
        status: number;
}

export interface IServiceResult<TResult, TError>{
        result?: TResult;
        error?: TError;
}

export interface IUserRepositoryResult<TResult, TError>{
        user?: TResult;
        error?: TError;
}

export interface IReturnResult {
        data: IServiceResult<MessageEntity | ChatEntity, IError>[];
        status: number;
}

export interface IReturnResultWithCount extends IReturnResult {
        count?: number;
}
