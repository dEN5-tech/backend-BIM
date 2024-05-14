import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectsController } from './projects.controller';


@Module({
  imports: [],
  providers: [PrismaService, ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}