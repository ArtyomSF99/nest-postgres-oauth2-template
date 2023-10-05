import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Res,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { TokenService } from 'src/token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log(req.user);
    const response = await this.authService.login(req.user);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
    });
    return response;
  }

  @Post('registration')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.userService.create(createUserDto);

    const { accessToken, refreshToken } = await this.tokenService.generateToken(
      response,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return {
      user: response,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    const newTokens = await this.tokenService.refresh(refreshToken);

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
    });

    return newTokens;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    await this.authService.logout(refreshToken);

    res.clearCookie('refreshToken');
    return { message: 'Token successfully removed' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
