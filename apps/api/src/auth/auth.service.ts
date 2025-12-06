import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify, hash } from 'argon2';
import { createHash } from 'crypto';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { UserService } from 'src/user/user.service';
import { AuthPayload } from './types/auth.jwtPayload';
import refreshConfig from './config/refresh.config';
import type { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    @Inject(refreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return await this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(userId: string, email: string, name: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    
    // Store hashed refresh token in database for validation (using deterministic hash)
    const hashedRefreshToken = createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
    
    return {
      user: {
        id: userId,
        email,
        name,
      },
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload: AuthPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const currentUser = { id: user.id, email: user.email, name: user.name };
    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken?: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    
    // If refresh token is provided, validate it against stored hash
    if (refreshToken && user.hashedRefreshToken) {
      try {
        // Hash the incoming refresh token using the same deterministic hash
        const hashedIncomingToken = createHash('sha256').update(refreshToken).digest('hex');
        if (hashedIncomingToken !== user.hashedRefreshToken) {
          throw new UnauthorizedException('invalid refresh token');
        }
      } catch (error) {
        throw new UnauthorizedException('invalid refresh token');
      }
    }
    
    const currentUser = { id: user.id, email: user.email, name: user.name };
    return currentUser;
  }

  async refreshToken(userId: string, email: string, name: string, oldRefreshToken?: string) {
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(userId);
    
    // Store new hashed refresh token (token rotation) using deterministic hash
    const hashedRefreshToken = createHash('sha256').update(newRefreshToken).digest('hex');
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
    
    // Optionally invalidate old refresh token if provided
    // This prevents token reuse attacks
    
    return {
      user: {
        id: userId,
        email,
        name,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
}
}