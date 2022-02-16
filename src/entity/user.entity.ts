import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interface/userInterfaces';
import { UserGenderEnum } from '../enums/user.enums';

@Entity()
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      unique: true,
    })
    email: string;

    @Column({
    })
    password: string;

    @Column({
      nullable: true,
      default: null,
    })
    first_name: string;

    @Column({
      nullable: true,
      default: null,
    })
    last_name: string;

    @Column({
      nullable: true,
      default: null,
      type: 'date',
    })
    date_of_birthday: Date;

    @Column({
      type: 'enum',
      enum: UserGenderEnum,
      nullable: true,
      default: null,
    })
    gender: UserGenderEnum;

    @Column({
      nullable: true,
      default: null,
      type: 'date',
    })
    confirmation_send_at: Date;

    @Column({
      nullable: true,
      default: null,
      type: 'date',
    })
    activated_at: Date;

    @Column({
      type: 'jsonb',
      array: false,
      default: () => "'[]'",
      nullable: false,
    })
    session: Array<{ session_id: number, expired_at: Date }> = [];
}
