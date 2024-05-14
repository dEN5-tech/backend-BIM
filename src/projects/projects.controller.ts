import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project, Prisma } from '@prisma/client';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: Prisma.ProjectCreateInput): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectsService.projects({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project | null> {
    return this.projectsService.project({ id: Number(id) });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: Prisma.ProjectUpdateInput,
  ): Promise<Project> {
    return this.projectsService.updateProject({
      where: { id: Number(id) },
      data: updateProjectDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Project> {
    return this.projectsService.deleteProject({ id: Number(id) });
  }
}