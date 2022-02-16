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
