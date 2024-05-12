import { Controller, Get, Param, Post, Body, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  async getChatById(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getChatById(id);
  }

  @Get()
  async getAllChats() {
    return this.chatService.getAllChats();
  }

  @Get(':from/:to')
  async getChatByUsersSentFromTo(
    @Param('from', ParseIntPipe) from: number,
    @Param('to', ParseIntPipe) to: number
  ) {
    return this.chatService.getChatByUsersSentFromTo(from, to);
  }

  @Post('messages')
  async sendMessage(
    @Body() messageData: { userId: number, receiverId: number, content: string, image?: string, document?: string }
  ) {
    // Assuming you need to initiate a chat first or find an existing one
    const chat = await this.chatService.initiateChat(messageData.userId, messageData.receiverId);
    return this.chatService.createMessage(chat.id, messageData.userId, messageData.content, messageData.image, messageData.document);
  }
}