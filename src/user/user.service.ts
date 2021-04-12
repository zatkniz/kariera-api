import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<CreateUserDto & User> {
    try {
      const emailAllreadyExist: User = await this.findByEmail(user.email);

      if (emailAllreadyExist) {
        throw new BadRequestException('Email already exist');
      }

      user.password = await bcrypt.hash(user.password.toString(), 10);

      return this.userRepository.save<CreateUserDto>(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  async remove(id: number): Promise<UpdateResult> {
    try {
      await this.findById(id);
      return await this.userRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder()
      .addSelect('User.password')
      .where('User.email = :email', { email })
      .getOne();
  }
}
