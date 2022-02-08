export interface IError {
        data: string;
        status: number;
}

export interface IServiceResult<TResult, TError>{
        result?: TResult;
        error?: TError;
}
