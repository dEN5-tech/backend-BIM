import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('message')
  async createMessage(@Body() messageData: {chatId: number, senderId: number, receiverId: number, content: string, image?: string, document?: string}) {
    return this.appService.createMessage(messageData);
  }

  
  @Get('message/:id')
  async getMessageById(@Param('id', ParseIntPipe) messageId: number) {
    return this.appService.getMessageById(messageId);
  }
}