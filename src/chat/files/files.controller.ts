import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UploadedFiles, HttpCode, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException({
        message: "Unexpected field",
        error: "Bad Request",
        statusCode: 400
      });
    }
    console.log(files);
    return this.filesService.uploadFile({ userId: 'user1', chatId: 'chat1', files });
  }

  @Get(':id')
  async getFileById(@Param('id', ParseIntPipe) fileId: number) {
    return this.filesService.getFileById(fileId);
  }

  @Put(':id')
  async updateFile(@Param('id', ParseIntPipe) fileId: number, @Body() fileData: { newFile: Express.Multer.File }) {
    return this.filesService.updateFile(fileId, fileData);
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) fileId: number) {
    return this.filesService.deleteFile(fileId);
  }
}
