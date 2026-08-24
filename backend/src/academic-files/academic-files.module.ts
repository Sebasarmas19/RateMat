import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicFile } from './academic-file.entity';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';
import { AcademicFilesService } from './academic-files.service';
import { AcademicFilesController } from './academic-files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicFile, ProfessorSubject])],
  controllers: [AcademicFilesController],
  providers: [AcademicFilesService],
})
export class AcademicFilesModule {}
