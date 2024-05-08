import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './chat/files/files.module';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

