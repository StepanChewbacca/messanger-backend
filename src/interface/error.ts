import { UpdateResult } from "typeorm";
import { IUser } from "./userInterfaces";

export interface IError {
        data: string;
        status: number;
}

export interface IServiceResult<TResult, TError>{
        result?: TResult;
        error?: TError;
}


export interface IUserRepositoryResult<TResult, TError>{
        user?: IUser;
        error?: TError;
}

export interface IUpdateUserRepositoryResult<TResult, TError>{
        user?: UpdateResult;
        error?: TError;
}