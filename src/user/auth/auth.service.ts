import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async getIdByToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
