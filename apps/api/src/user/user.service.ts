import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await hash(password);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    if (id === undefined || id === null) {
      return null;
    }
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await hash(data.password);
    }
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
