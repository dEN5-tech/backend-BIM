import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(userData: { email: string; name?: string }) {
    return this.prismaService.user.create({
      data: userData,
    });
  }

  async getUserById(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(userId: number, userData: { email?: string; name?: string }) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  async deleteUser(userId: number) {
    return this.prismaService.user.delete({
      where: { id: userId },
    });
  }
}
