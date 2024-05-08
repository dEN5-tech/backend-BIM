import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule], // Import the module that exports PrismaService
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule {}
