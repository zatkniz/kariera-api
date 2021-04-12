import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  Put,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '../user/auth/guard/auth.guard';
import { AuthService } from '../user/auth/auth.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() request: any, @Body() createCompanyDto: CreateCompanyDto) {
    try {
      return this.companyService.create(
        createCompanyDto,
        request.headers?.authorization.split(' ').pop(),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Req() request: any,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const company = await this.companyService.findById(+id);
      const token = request.headers?.authorization.split(' ').pop();
      const user = await this.authService.getIdByToken(token);

      if (company.user_id != user.id) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }

      return await this.companyService.update(company, updateCompanyDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<UpdateResult> {
    try {
      await this.companyService.remove(+id);
      return res.status(200).json({
        statusCode: 200,
        message: 'Company Deleted Successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
