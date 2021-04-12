import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository, UpdateResult } from 'typeorm';
import { AuthService } from '../user/auth/auth.service';
import { Observable, from } from 'rxjs';
import { CompanyService } from '../company/company.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private authService: AuthService,
    private companyService: CompanyService,
  ) {}

  async create(
    job: CreateJobDto,
    token: string,
  ): Promise<Observable<CreateJobDto & Job>> {
    try {
      const { id } = await this.authService.getIdByToken(token);
      job.user_id = id;

      const company = await this.companyService.findById(job.company_id);

      if (!company) {
        throw new NotFoundException('The company does not exist');
      }

      if (company.user_id != job.user_id) {
        throw new UnauthorizedException(
          'You cannot save Job for a company that you dont own',
        );
      }

      return from(this.jobRepository.save<CreateJobDto>(job));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    job: Job,
    updateJobDto: UpdateJobDto,
  ): Promise<UpdateJobDto & Job> {
    try {
      const { title, description } = updateJobDto;
      job.title = title;
      job.description = description;
      return await this.jobRepository.save<UpdateJobDto>(job);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: number): Promise<Job> {
    try {
      return await this.jobRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async remove(id: number): Promise<UpdateResult> {
    try {
      await this.findById(id);
      return await this.jobRepository.softDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
