export interface IError {
        data: string,
        status: number
}

export interface IServiceResult<T, T2>{
        result?: T,
        error?: T2
}
