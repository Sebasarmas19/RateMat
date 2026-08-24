import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorSubject } from './professor-subject.entity';
import { ProfessorSubjectsService } from './professor-subjects.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessorSubject])],
  providers: [ProfessorSubjectsService],
  exports: [ProfessorSubjectsService],
})
export class ProfessorSubjectsModule {}
