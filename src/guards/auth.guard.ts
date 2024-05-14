import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');

    try {
      // Use the Prisma service to validate the token or fetch user details
      const user = await this.prismaService.user.findUnique({
        where: { email, password }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Optionally attach user to request for further use in route handlers
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }
    const [type, token] = authHeader.split(' ');
    return type === 'Basic' ? token : undefined;
  }
}