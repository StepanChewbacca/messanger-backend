import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChatEntity } from './chat.entity';
import { IMessage } from '../interface/message.interface';

@Entity()
export class MessageEntity implements IMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'text',
    })
    text: string;

    @Column({
      type: 'boolean',
    })
    read: boolean;

    @Column({
      type: 'timestamptz',
    })
    send_date: Date;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @ManyToOne(() => ChatEntity, (chat) => chat.id)
    chat: ChatEntity;
}
