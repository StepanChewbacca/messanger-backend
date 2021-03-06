import { getRepository, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { IUser } from '../interface/user.interfaces';
import { IUserRepositoryResult } from '../interface/returns.interface';
import { sendErrorToTelegram } from '../services/telegramAPI.service';

export class UserRepository {
  typeORMRepository: Repository<UserEntity>;

  async createUser(userData: IUser): Promise<IUserRepositoryResult<IUser, Error>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      const user = await this.typeORMRepository.save(userData);

      return { user };
    } catch (error) {
      await sendErrorToTelegram(error);

      return { error };
    }
  }

  async addInfoUser(userAdditionalInfo: IUser, email: string): Promise<IUserRepositoryResult<UpdateResult, Error>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      const user = await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        first_name: userAdditionalInfo.first_name,
        last_name: userAdditionalInfo.last_name,
        date_of_birthday: userAdditionalInfo.date_of_birthday,
        gender: userAdditionalInfo.gender,
        activated_at: new Date(),
      })
        .where('email = :email', { email })
        .returning('*')
        .execute();

      return { user };
    } catch (error) {
      console.error(error);
      await sendErrorToTelegram(error);

      return { error };
    }
  }

  async getUserByEmail(email: string): Promise<IUserRepositoryResult<IUser, Error>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      const user = await this.typeORMRepository.findOne({ where: { email } });

      return { user };
    } catch (error) {
      console.error(error);
      await sendErrorToTelegram(error);

      return { error };
    }
  }

  async changePassword(newPassword: IUser['password'], email: string): Promise<IUserRepositoryResult<UpdateResult, Error>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      const user = await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        password: newPassword,
      })
        .where('email = :email', { email })
        .returning('*')
        .execute();

      return { user };
    } catch (error) {
      console.error(error);
      await sendErrorToTelegram(error);

      return { error };
    }
  }
}

export const userRepository = new UserRepository();
