import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AuthService } from 'src/user/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Company } from 'src/company/entities/company.entity';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    TypeOrmModule.forFeature([Company]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [JobController],
  providers: [JobService, AuthService, CompanyService],
})
export class JobModule {}
