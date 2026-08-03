import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import refreshConfig from './config/refresh.config';
import { hashSecret } from '../common/security/hashing';
import { Role } from '../generated/enums';

describe('AuthService', () => {
  let service: AuthService;
  let userService: { findByEmail: jest.Mock; findById: jest.Mock };
  let jwtService: { signAsync: jest.Mock };
  let prisma: { user: { findUnique: jest.Mock; update: jest.Mock } };

  const baseUser = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'User One',
    role: Role.USER,
    password: 'hashed-password',
    hashedRefreshToken: null as string | null,
  };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    };
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prisma },
        {
          provide: refreshConfig.KEY,
          useValue: { secret: 'refresh-secret', expiresIn: 3600 },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateLocalUser', () => {
    it('throws UnauthorizedException when the user does not exist', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateLocalUser('missing@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password does not verify', async () => {
      const hashed = await hashSecret('correct-password');
      userService.findByEmail.mockResolvedValue({
        ...baseUser,
        password: hashed,
      });

      await expect(
        service.validateLocalUser(baseUser.email, 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns a sanitized user when credentials are valid', async () => {
      const hashed = await hashSecret('correct-password');
      userService.findByEmail.mockResolvedValue({
        ...baseUser,
        password: hashed,
      });

      const result = await service.validateLocalUser(
        baseUser.email,
        'correct-password',
      );

      expect(result).toEqual({
        id: baseUser.id,
        name: baseUser.name,
        email: baseUser.email,
        role: baseUser.role,
      });
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('validateJwtUser', () => {
    it('returns the sanitized user when findById resolves', async () => {
      userService.findById.mockResolvedValue(baseUser);

      const result = await service.validateJwtUser(baseUser.id);

      expect(result).toEqual({
        id: baseUser.id,
        email: baseUser.email,
        name: baseUser.name,
        role: baseUser.role,
      });
    });

    it('throws UnauthorizedException when findById throws NotFoundException', async () => {
      userService.findById.mockRejectedValue(
        new NotFoundException('User with ID user-1 not found'),
      );

      await expect(service.validateJwtUser(baseUser.id)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('re-throws any other error from findById unchanged', async () => {
      const unexpected = new Error('db is down');
      userService.findById.mockRejectedValue(unexpected);

      await expect(service.validateJwtUser(baseUser.id)).rejects.toBe(
        unexpected,
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('throws UnauthorizedException when hashedRefreshToken is null', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken: null,
      });

      await expect(
        service.validateRefreshToken(baseUser.id, 'some-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when no refreshToken argument is passed', async () => {
      const hashedRefreshToken = await hashSecret('stored-refresh-token');
      prisma.user.findUnique.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken,
      });

      await expect(
        service.validateRefreshToken(baseUser.id, undefined),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the token does not verify against the stored hash', async () => {
      const hashedRefreshToken = await hashSecret('stored-refresh-token');
      prisma.user.findUnique.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken,
      });

      await expect(
        service.validateRefreshToken(baseUser.id, 'wrong-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns the sanitized user when the token verifies', async () => {
      const hashedRefreshToken = await hashSecret('stored-refresh-token');
      prisma.user.findUnique.mockResolvedValue({
        ...baseUser,
        hashedRefreshToken,
      });

      const result = await service.validateRefreshToken(
        baseUser.id,
        'stored-refresh-token',
      );

      expect(result).toEqual({
        id: baseUser.id,
        email: baseUser.email,
        name: baseUser.name,
        role: baseUser.role,
      });
    });
  });

  describe('refreshToken', () => {
    it('calls prisma.user.update with a freshly-hashed refresh token, rotating it on every call', async () => {
      prisma.user.update.mockResolvedValue(baseUser);

      await service.refreshToken(
        baseUser.id,
        baseUser.email,
        baseUser.name,
        baseUser.role,
      );

      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      const firstCallData = prisma.user.update.mock.calls[0][0].data;
      expect(typeof firstCallData.hashedRefreshToken).toBe('string');
      expect(firstCallData.hashedRefreshToken.length).toBeGreaterThan(0);

      await service.refreshToken(
        baseUser.id,
        baseUser.email,
        baseUser.name,
        baseUser.role,
      );

      const secondCallData = prisma.user.update.mock.calls[1][0].data;
      expect(typeof secondCallData.hashedRefreshToken).toBe('string');
      expect(secondCallData.hashedRefreshToken).not.toBe(
        firstCallData.hashedRefreshToken,
      );
    });
  });

  describe('logout', () => {
    it('calls prisma.user.update setting hashedRefreshToken to null', async () => {
      prisma.user.update.mockResolvedValue(baseUser);

      const result = await service.logout(baseUser.id);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { hashedRefreshToken: null },
      });
      expect(result).toEqual({ success: true });
    });
  });
});
