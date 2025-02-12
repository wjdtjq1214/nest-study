import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async singUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    authCredentialDto.password = await bcrypt.hash(
      authCredentialDto.password,
      await bcrypt.genSalt(),
    );
    return await this.userRepository.createUser(authCredentialDto);
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<AuthSigninDto> {
    const user = await this.userRepository.getUserByUserName(
      authCredentialDto.userName,
    );

    if (!(await bcrypt.compare(authCredentialDto.password, user.password)))
      throw new UnauthorizedException(`wrong password`);

    const result = {
      accessToken: this.jwtService.sign({ userName: user.userName }),
      userName: user.userName,
    };

    return result;
  }
}
