import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicFile } from './academic-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicFile])],
})
export class AcademicFilesModule {}
