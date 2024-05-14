import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signIn(email: string, password: string): Promise<{token:string}> {
    // Here you would typically check the credentials against the database
    const user = await this.prismaService.user.findUnique({
      where: { email, password }, // Note: Storing plain passwords is not recommended; use hashed passwords
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // If authentication is successful, return the Base64-encoded email and password
    return {token:this.encodeCredentials(email, password)};
  }

  
  private encodeCredentials(email: string, password: string): string {
    return Buffer.from(`${email}:${password}`).toString('base64');
  }
}