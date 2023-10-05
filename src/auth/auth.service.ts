import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/entities/user.entity';
import { AuthResponseUserDto } from 'src/user/dto/auth-response-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user) throw new BadRequestException('User not found');

    const isSame = await bcrypt.compare(password, user.password);

    if (isSame) {
      return user;
    }
    throw new BadRequestException('Password is not correct');
  }

  async login(user: User) {
    const { accessToken, refreshToken } = await this.tokenService.generateToken(
      user,
    );

    const responseUser = new AuthResponseUserDto(user);

    return {
      user: responseUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Token is missing');
    return this.tokenService.remove(refreshToken);
  }
}
