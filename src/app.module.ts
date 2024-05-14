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
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { EventsService } from './events/events.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';

@Module({
  imports: [PrismaModule,
    FilesModule,
    UserModule,
    EventsModule,
    AuthModule,
    ProjectsModule
  ], // Added UserModule to imports
  controllers: [
    AppController,
    UserController,
    ChatController,
    EventsController,
    AuthController,
    ProjectsController
  ], // Added UserController to controllers array
  providers: [AppService,
     UserService,
      ChatService, 
      EventsService,
    AuthService,
  ProjectsService], // Added UserService to providers
})
export class AppModule {}
