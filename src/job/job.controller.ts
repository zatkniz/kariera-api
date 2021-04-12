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
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '../user/auth/guard/auth.guard';
import { AuthService } from '../user/auth/auth.service';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() request: any, @Body() createJobDto: CreateJobDto) {
    try {
      return this.jobService.create(
        createJobDto,
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
    @Body() updateJobDto: UpdateJobDto,
  ) {
    try {
      const job = await this.jobService.findById(+id);
      const token = request.headers?.authorization.split(' ').pop();
      const user = await this.authService.getIdByToken(token);

      if (job.user_id != user.id) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }

      return await this.jobService.update(job, updateJobDto);
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
      await this.jobService.remove(+id);
      return res.status(200).json({
        statusCode: 200,
        message: 'Job Deleted Successfully',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
