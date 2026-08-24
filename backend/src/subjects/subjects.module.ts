import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { ProfessorSubjectsModule } from '../professor-subjects/professor-subjects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject]),
    ProfessorSubjectsModule,
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
