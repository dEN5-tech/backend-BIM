import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: { email: string; name?: string }) {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
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
