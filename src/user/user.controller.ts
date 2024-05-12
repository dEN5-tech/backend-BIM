import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: { email: string; name: string; password: string; avatar: string }) {
    return this.userService.createUser(userData);
  }

  @Get('search')
  async getUserByNameIncludes(@Query('nameIncludes') nameIncludes: string) {
    return this.userService.getUserByNameIncludes(nameIncludes);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) userId: number, @Body() userData: { email?: string; name?: string }) {
    return this.userService.updateUser(userId, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }
}
