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
  async getUserById(id: string): Promise<IUser> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      return await this.typeORMRepository.findOne({ where: { id } });
    } catch (err) {
      console.error(err);

      return null;
    }
  }
  async addInfoUser(userAdditionalInfo: IUser, id: string): Promise<UpdateResult> {
    try {
      this.typeORMRepository = getRepository(UserEntity);

      return await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        first_name: userAdditionalInfo.first_name,
        last_name: userAdditionalInfo.last_name,
        date_of_birthday: userAdditionalInfo.date_of_birthday,
        gender: userAdditionalInfo.gender,
        activated_at: new Date(),
      })
        .where('id = :id', { id })
        .returning('*')
        .execute();
    } catch (err) {
      console.error(err);

      return null;
    }
  }
}

export const userRepository = new UserRepository();
