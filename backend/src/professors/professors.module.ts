import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './professor.entity';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';
import { Subject } from '../subjects/subject.entity';
import { Review } from '../reviews/review.entity';
import { ProfessorsService } from './professors.service';
import { ProfessorsController } from './professors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Professor, ProfessorSubject, Subject, Review])],
  controllers: [ProfessorsController],
  providers: [ProfessorsService],
  exports: [ProfessorsService],
})
export class ProfessorsModule {}
