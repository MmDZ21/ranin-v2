import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { UserService } from '../user/user.service';
import { AuthPayload } from './types/auth.jwtPayload';
import refreshConfig from './config/refresh.config';
import { PrismaService } from '../prisma/prisma.service';
import { hashSecret, verifySecret } from '../common/security/hashing';
import { Role } from '../generated/enums';

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
    const existing = await this.userService.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }
    // userService.create assigns the USER role and returns a sanitized record
    // (no password / refresh-token hash).
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // Single generic message for both unknown-email and bad-password to avoid
    // account enumeration.
    if (!user || !(await verifySecret(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async login(userId: string, email: string, name: string | null, role: Role) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: await hashSecret(refreshToken) },
    });
    return {
      user: { id: userId, email, name, role },
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
    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async validateRefreshToken(userId: string, refreshToken?: string) {
    // Needs the stored hash, so query the full record directly. A refresh is
    // only accepted when a stored hash exists AND verifies against the token.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken || !refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const valid = await verifySecret(user.hashedRefreshToken, refreshToken);
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async refreshToken(
    userId: string,
    email: string,
    name: string | null,
    role: Role,
  ) {
    // Rotate: issue new tokens and replace the stored refresh-token hash so the
    // previous refresh token can no longer be used.
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: await hashSecret(refreshToken) },
    });
    return {
      user: { id: userId, email, name, role },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
    return { success: true };
  }
}
