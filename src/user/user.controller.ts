import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from './auth/guard/auth.guard';
import { User } from './entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';

export interface DeleteStatus {
  statusCode: number;
  message: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({ type: User, status: 200 })
  @UseGuards(AuthGuard)
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  @Delete(':id')
  @ApiResponse({ type: UpdateResult, status: 200 })
  async remove(@Param('id') id: string): Promise<DeleteStatus> {
    await this.userService.remove(+id);
    return {
      statusCode: 200,
      message: 'User Deleted Successfully',
    };
  }
}
