import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { IChat } from '../interface/chat.interface';
import { UserEntity } from './user.entity';

@Entity()
export class ChatEntity implements IChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'text',
    })
    name: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];
}
