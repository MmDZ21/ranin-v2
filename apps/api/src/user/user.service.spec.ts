import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/enums';

const SAFE_OMIT = { password: true, hashedRefreshToken: true } as const;

function makePrismaMock() {
  return {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('UserService', () => {
  let service: UserService;
  let prisma: ReturnType<typeof makePrismaMock>;

  beforeEach(async () => {
    prisma = makePrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('forces role to USER even when the DTO is smuggled in with role: ADMIN', async () => {
      prisma.user.create.mockResolvedValue({ id: '1' });

      await service.create({
        email: 'x@example.com',
        password: 'pw',
        name: 'X',
        role: Role.ADMIN,
      } as any);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      const { data } = prisma.user.create.mock.calls[0][0];
      expect(data.role).toBe(Role.USER);
    });

    it('passes omit: SAFE_OMIT so password hashes never leak through this path', async () => {
      prisma.user.create.mockResolvedValue({ id: '1' });

      await service.create({
        email: 'x@example.com',
        password: 'pw',
        name: 'X',
      });

      const callArgs = prisma.user.create.mock.calls[0][0];
      expect(callArgs.omit).toEqual(SAFE_OMIT);
    });

    it('hashes the password before passing it to prisma.user.create', async () => {
      prisma.user.create.mockResolvedValue({ id: '1' });
      const plaintext = 'pw';

      await service.create({
        email: 'x@example.com',
        password: plaintext,
        name: 'X',
      });

      const { data } = prisma.user.create.mock.calls[0][0];
      expect(typeof data.password).toBe('string');
      expect(data.password.length).toBeGreaterThan(0);
      expect(data.password).not.toBe(plaintext);
    });
  });

  describe('findById', () => {
    it('throws NotFoundException when prisma.user.findUnique resolves null', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the user with omit: SAFE_OMIT when found', async () => {
      const user = { id: '1', email: 'x@example.com', name: 'X' };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findById('1');

      expect(result).toBe(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        omit: SAFE_OMIT,
      });
    });
  });

  describe('findByEmail', () => {
    it('returns whatever prisma.user.findUnique resolves, including null', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('missing@example.com');

      expect(result).toBeNull();
    });

    it('returns the full record (with password hash) without any omit option', async () => {
      const fullUser = {
        id: '1',
        email: 'x@example.com',
        password: 'hashed-password',
        hashedRefreshToken: 'hashed-refresh-token',
      };
      prisma.user.findUnique.mockResolvedValue(fullUser);

      const result = await service.findByEmail('x@example.com');

      expect(result).toBe(fullUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'x@example.com' },
      });
      const callArgs = prisma.user.findUnique.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('omit');
    });
  });
});
