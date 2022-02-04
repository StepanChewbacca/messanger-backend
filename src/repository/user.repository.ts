import { getRepository, Repository, UpdateResult } from 'typeorm';
import { User } from '../entity/user';
import { IUser } from '../interface/userInterfaces';

export class UserRepository {
  typeORMRepository: Repository<User>;

  async createUser(userData: IUser): Promise<IUser> {
    try {
      this.typeORMRepository = getRepository(User);

      return await this.typeORMRepository.save(userData);
    } catch (err) {
      console.error(err);

      return null;
    }
  }
  async getUserById(id: string): Promise<IUser> {
    try {
      this.typeORMRepository = getRepository(User);

      return await this.typeORMRepository.findOne({ where: { id } });
    } catch (err) {
      console.error(err);

      return null;
    }
  }
  async addInfoUser(userAdditionalInfo: IUser, id: string): Promise<UpdateResult> {
    try {
      this.typeORMRepository = getRepository(User);

      return await this.typeORMRepository.createQueryBuilder().update(User).set({
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
