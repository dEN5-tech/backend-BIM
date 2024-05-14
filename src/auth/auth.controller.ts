import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: { email: string; password: string }) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    const {password, ...other} = req.user;
    return other;
  }
}
