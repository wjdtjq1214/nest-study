import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialDto: AuthCredentialDto): Promise<User> {
    try {
      const user = this.create(authCredentialDto);
      await this.save(user);

      return user;
    } catch (e: any) {
      if (e.code === '23505') throw new ConflictException('Existing User');
      else throw new InternalServerErrorException(e.message);
    }
  }

  async getUserByUserName(userName: string): Promise<User> {
    const result = await this.findOne({
      where: {
        userName: userName,
      },
    });

    if (!result)
      throw new UnauthorizedException(`${userName} User is not found`);

    return result;
  }
}
