import {
  Controller,
  Post,
  BadRequestException,
  Body,
  Get,
  UseGuards,
  Session,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtResponse } from './interfaces/jwt-response.interface';
import { AuthGuard } from './guard/auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Session() session: Record<string, any>,
    @Body() { email, password }: LoginDto,
  ): Promise<JwtResponse> {
    //TODO: move the login - register logic to auth.service
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    if (!user.comparePassword(password)) {
      throw new BadRequestException('invalid credentials');
    }

    const acces_token = await this.jwtService.signAsync({ id: user.id });

    //Comment: There is allready build service for storing and query users after log in but i found it a bit late
    session.user = user;
    return { acces_token };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res: any,
  ): Promise<UpdateResult> {
    try {
      await this.userService.create(createUserDto);

      return res.status(201).json({
        statusCode: 201,
        message: 'User registered Successfully',
      });
    } catch ({ message }) {
      throw new BadRequestException(message);
    }
  }

  @Get('user')
  @ApiResponse({ type: User, status: 200 })
  @UseGuards(AuthGuard)
  async auth(@Req() request: any): Promise<User> {
    try {
      const { id } = await this.authService.getIdByToken(
        request.headers?.authorization.split(' ').pop(),
      );

      if (!id) {
        throw new UnauthorizedException();
      }

      const user: User = await this.userService.findById(+id);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
