import { Controller, Get, Param } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ProfessorSubjectsService } from '../professor-subjects/professor-subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly professorSubjectsService: ProfessorSubjectsService,
  ) {}

  @Get(':id/professors')
  async getProfessors(@Param('id') id: string) {
    return this.professorSubjectsService.getApprovedProfessorsForSubject(id);
  }
}
