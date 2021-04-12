import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeaders = request.headers?.authorization;

    if (!authHeaders) {
      throw new HttpException(
        'Missing authorization headers',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.validateToken(authHeaders);
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  async validateToken(auth: string): Promise<string | any> {
    if (!/^Bearer*/i.test(auth)) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    const token: string = auth.split(' ').pop();
    try {
      return await jwt.verify(token, 'secret');
    } catch (error) {
      const message = `Token error: ${error.message || error.name}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
