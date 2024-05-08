import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(fileData: { userId: string; chatId: string; files: Express.Multer.File[] }) {
    const uploadDir = join(__dirname, '..', '..', 'uploads');
    try {
      await fsPromises.mkdir(uploadDir, { recursive: true });
      const uploadResults = await Promise.all(fileData.files.map(async (file) => {
        const filePath = join(uploadDir, file.originalname);
        await fsPromises.writeFile(filePath, file.buffer);
        return { message: 'File uploaded successfully', filePath };
      }));
      return uploadResults;
    } catch (error) {
      return { message: 'Failed to upload file', error: `Error during file upload: ${error.message}` };
    }
  }
  async getFileById(fileId: number) {
    const uploadDir = join(__dirname, '..', '..', 'uploads');
    const filePath = join(uploadDir, `${fileId}.file`); // Assuming files are named by their ID

    try {
      const fileContent = await fsPromises.readFile(filePath);
      return { message: 'File retrieved successfully', fileContent };
    } catch (error) {
      return { message: 'Failed to retrieve file', error };
    }
  }

  async updateFile(fileId: number, fileData: { newFile: Express.Multer.File }) {
    const uploadDir = join(__dirname, '..', '..', 'uploads');
    const filePath = join(uploadDir, `${fileId}.file`); // Assuming files are named by their ID

    try {
      await fsPromises.writeFile(filePath, fileData.newFile.buffer);
      return { message: 'File updated successfully', filePath };
    } catch (error) {
      return { message: 'Failed to update file', error };
    }
  }

  async deleteFile(fileId: number) {
    const uploadDir = join(__dirname, '..', '..', 'uploads');
    const filePath = join(uploadDir, `${fileId}.file`); // Assuming files are named by their ID

    try {
      await fsPromises.unlink(filePath);
      return { message: 'File deleted successfully', fileId };
    } catch (error) {
      return { message: 'Failed to delete file', error };
    }
  }
}
