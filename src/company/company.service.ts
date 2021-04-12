import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Observable, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AuthService } from '../user/auth/auth.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private authService: AuthService,
  ) {}

  async create(
    company: CreateCompanyDto,
    token: string,
  ): Promise<Observable<CreateCompanyDto & Company>> {
    try {
      const { id } = await this.authService.getIdByToken(token);
      company.user_id = id;
      return from(this.companyRepository.save<CreateCompanyDto>(company));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    company: Company,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<UpdateCompanyDto & Company> {
    try {
      const { name, address } = updateCompanyDto;
      company.name = name;
      company.address = address;
      return await this.companyRepository.save<UpdateCompanyDto>(company);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: number): Promise<Company> {
    try {
      return await this.companyRepository.findOneOrFail(id);
    } catch (error) {
      throw new NotFoundException('The company does not exist');
    }
  }

  async remove(id: number): Promise<UpdateResult> {
    try {
      await this.findById(id);
      return await this.companyRepository.softDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
