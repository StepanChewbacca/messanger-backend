import { UpdateResult } from 'typeorm';
import { UserGenderEnum } from '../enums/user.enums';

export interface IUser {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    date_of_birthday: Date;
    gender: UserGenderEnum;
    confirmation_send_at: Date;
    activated_at: Date;
    session: { session_id: number, expired_at: Date }[];
}

export interface IUpdateResultUser {
    user: UpdateResult;
}
