import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSecret } from '../common/security/hashing';
import { Role } from '../generated/enums';

// Never return these to API consumers.
const SAFE_OMIT = { password: true, hashedRefreshToken: true } as const;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    return this.prisma.user.create({
      data: {
        ...userData,
        password: await hashSecret(password),
        // Force USER on self-service creation — admins are provisioned via seed.
        role: Role.USER,
      },
      omit: SAFE_OMIT,
    });
  }

  /**
   * Internal use only (authentication): returns the full record INCLUDING the
   * password hash. Never expose this result from a controller.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    if (!id) {
      return null;
    }
    return this.prisma.user.findUnique({ where: { id }, omit: SAFE_OMIT });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      omit: SAFE_OMIT,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const updateData: { name?: string; email?: string; password?: string } = {
      name: data.name,
      email: data.email,
    };
    if (data.password) {
      updateData.password = await hashSecret(data.password);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      omit: SAFE_OMIT,
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }
}
