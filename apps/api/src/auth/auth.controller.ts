import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user.id, req.user.email, req.user.name);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    const oldRefreshToken = req.body?.refresh;
    return this.authService.refreshToken(
      req.user.id,
      req.user.email,
      req.user.name,
      oldRefreshToken,
    );
  }
}
