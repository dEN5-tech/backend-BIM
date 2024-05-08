import { Injectable } from '@nestjs/common';
import { User, Chat, Message } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; name?: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(userId: number, data: { email?: string; name?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async createChat(data: { userIds: number[] }) {
    return this.prisma.chat.create({
      data: {
        users: {
          connect: data.userIds.map(id => ({ id })),
        },
      },
    });
  }

  async getChatById(chatId: number) {
    return this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: true,
        users: true,
      },
    });
  }

  async createMessage(data: { userId: number; chatId: number; content: string; image?: string; document?: string }) {
    return this.prisma.message.create({
      data,
    });
  }

  async getMessageById(messageId: number) {
    return this.prisma.message.findUnique({
      where: { id: messageId },
    });
  }
}
