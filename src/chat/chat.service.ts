import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Получить чат по идентификатору
  async getChatById(id: number): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        users: true,
        messages: true,
      },
    });
  }

  // Получить все чаты
  async getAllChats(): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      include: {
        users: true,
        messages: true,
      },
    });
  }

  // Инициировать чат между двумя пользователями
  async initiateChat(user1Id: number, user2Id: number): Promise<Chat> {
    let chat = await this.prisma.chat.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [user1Id, user2Id],
            },
          },
        },
      },
    });

    if (!chat) {
      chat = await this.prisma.chat.create({
        data: {
          users: {
            connect: [{ id: user1Id }, { id: user2Id }],
          },
        },
      });
    }

    return chat;
  }

  // Получить чат по идентификаторам пользователей, которые отправили сообщения друг другу
  async getChatByUsersSentFromTo(from: number, to: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        messages: {
          some: {
            OR: [
              { userId: from, chat: { users: { some: { id: to } } } },
              { userId: to, chat: { users: { some: { id: from } } } },
            ],
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            avatar: true,
          }
        },
        messages: {
          select: {
            id: true,
            content: true,
            image: true,
            document: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            }
          }
        },
      },
    });

    if (!chat) return null;

    return {
      id: chat.id,
      users: chat.users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        avatar: user.avatar,
      })),
      messages: chat.messages.map(message => ({
        id: message.id,
        content: message.content,
        image: message.image,
        document: message.document,
        user: {
          id: message.user.id,
          name: message.user.name,
          avatar: message.user.avatar,
        },
      })),
    };
  }

  // Создать сообщение
  async createMessage(chatId: number, userId: number, content: string, image?: string, document?: string): Promise<Message> {
    return this.prisma.message.create({
      data: {
        content,
        userId,
        chatId,
        image,
        document,
      },
    });
  }
}