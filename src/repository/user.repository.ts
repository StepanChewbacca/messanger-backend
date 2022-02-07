import { getRepository, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { IUser } from '../interface/userInterfaces';

export class UserRepository {
  typeORMRepository: Repository<UserEntity>;

  async createUser(userData: IUser): Promise<IUser> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      return await this.typeORMRepository.save(userData);
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async addInfoUser(userAdditionalInfo: IUser, email: string): Promise<UpdateResult> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      return await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        first_name: userAdditionalInfo.first_name,
        last_name: userAdditionalInfo.last_name,
        date_of_birthday: userAdditionalInfo.date_of_birthday,
        gender: userAdditionalInfo.gender,
        activated_at: new Date(),
      })
        .where('email = :email', { email })
        .returning('*')
        .execute();
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  async getUserByEmail(email: IUser['email']): Promise<IUser> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      return await this.typeORMRepository.findOne({ where: { email } });
    } catch (err) {
      console.error(err);

      return null;
    }
  }

  changePassword = async (newPassword: IUser['password'], email: string): Promise<UpdateResult> => {
    try {
      console.log(newPassword, 'jopa');
      console.log(email);
      this.typeORMRepository = getRepository(UserEntity);

      return await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        password: newPassword,
      })
        .where('email = :email', { email })
        .returning('*')
        .execute();
    } catch (err) {
      console.error(err);

      return null;
    }
  };
}

export const userRepository = new UserRepository();
