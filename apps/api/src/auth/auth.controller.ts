import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('Login DTO:', dto);
    console.log('Email:', dto.email);
    console.log('Password length:', dto.password?.length);
    
    if (!dto.email || !dto.password) {
      throw new Error('Email and password are required');
    }
    
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }
}
