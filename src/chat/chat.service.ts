import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Chat, Message } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Get a chat by its ID
  async getChatById(id: number): Promise<Chat | null> {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        users: true,
        messages: true,
      },
    });
  }



  // Get all chats
  async getAllChats(): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      include: {
        users: true,
        messages: true,
      },
    });
  }

  // Initiate a chat between two users
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

  // Get a chat by user IDs where one has sent messages to the other
  async getChatByUsersSentFromTo(senderId: number, receiverId: number){
    const chat = await this.prisma.chat.findFirst({
      where: {
        messages: {
          some: {
            OR: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
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
        user: {
          id: message.sender.id,
          name: message.sender.name,
          avatar: message.sender.avatar,
        },
        content: message.content,
        image: message.image,
        document: message.document,
      })),
    };
  }

  // Create a message with a sender and receiver
async createMessage(chatId: number, senderId: number, receiverId: number, content: string, image?: string, document?: string): Promise<Message> {
  return this.prisma.message.create({
    data: {
      content,
      senderId,  // Correct field name as per schema
      receiverId, // Correct field name as per schema
      chatId,
      image,
      document,
    },
  });
}
}