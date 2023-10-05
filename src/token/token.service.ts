import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateTokenDto } from './dto/update-token.dto';
import { JwtService } from '@nestjs/jwt';
import { BackendConfigService } from 'src/config/config.service';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: BackendConfigService,
    private readonly userService: UserService,
  ) {}

  async generateToken(user: User) {
    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        expiresIn: this.configService.jwt.accessTokenTime,
        secret: this.configService.jwt.accessTokenSecret,
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        expiresIn: this.configService.jwt.refreshTokenTime,
        secret: this.configService.jwt.refreshTokenSecret,
      },
    );

    const isTokenExist = await this.tokenRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (isTokenExist) {
      isTokenExist.token = refreshToken;
      await this.tokenRepository.save(isTokenExist);
    } else {
      const newToken = new Token();
      newToken.user = user;

      await this.tokenRepository.save({
        user: user,
        token: refreshToken,
      });
    }

    return { accessToken, refreshToken };
  }

  async refresh(oldRefreshToken: string) {
    const isTokenExist = await this.tokenRepository.findOne({
      where: {
        token: oldRefreshToken,
      },
      relations: {
        user: true,
      },
    });

    if (!isTokenExist) throw new UnauthorizedException();

    try {
      const isValidToken = await this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.jwt.refreshTokenSecret,
      });
      const user = await this.userService.findOne(isValidToken.email);

      const { accessToken, refreshToken } = await this.generateToken(user);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  async remove(token: string) {
    try {
      return await this.tokenRepository.delete({ token: token });
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
