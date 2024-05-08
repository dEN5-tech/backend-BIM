import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  async getChatById(@Param('id') id: number) {
    return this.chatService.getChatById(id);
  }
}
