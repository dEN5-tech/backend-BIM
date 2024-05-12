import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller'; // Added UserController import
import { UserService } from './user/user.service'; // Added UserService import
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './chat/files/files.module';
import { UserModule } from './user/user.module'; // Added UserModule import
import { ChatController } from './chat/chat.controller'; // Added ChatController import
import { ChatService } from './chat/chat.service'; // Added ChatService import

@Module({
  imports: [PrismaModule, FilesModule, UserModule], // Added UserModule to imports
  controllers: [AppController, UserController, ChatController], // Added UserController to controllers array
  providers: [AppService, UserService, ChatService], // Added UserService to providers
})
export class AppModule {}

