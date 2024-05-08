import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChatById(id: number) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        users: true,
        messages: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
