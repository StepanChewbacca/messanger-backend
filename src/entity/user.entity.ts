import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interface/user.interfaces';
import { UserGenderEnum } from '../enums/user.enums';

@Entity()
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'text',
      unique: true,
    })
    email: string;

    @Column({
      type: 'text',
    })
    password: string;

    @Column({
      nullable: true,
      default: null,
      type: 'text',
    })
    first_name: string;

    @Column({
      type: 'text',
      nullable: true,
      default: null,
    })
    last_name: string;

    @Column({
      nullable: true,
      default: null,
      type: 'timestamptz',
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
      type: 'timestamptz',
    })
    confirmation_send_at: Date;

    @Column({
      nullable: true,
      default: null,
      type: 'timestamptz',
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
