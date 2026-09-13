import { Controller, Get, Param } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { ProfessorSubjectsService } from '../professor-subjects/professor-subjects.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly professorSubjectsService: ProfessorSubjectsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las materias' })
  @ApiResponse({ status: 200, description: 'Lista de materias devuelta exitosamente' })
  async getAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id/professors')
  @ApiOperation({ summary: 'Obtener profesores aprobados de una materia' })
  @ApiParam({ name: 'id', description: 'ID de la materia', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de profesores devuelta exitosamente' })
  async getProfessors(@Param('id') id: string) {
    return this.professorSubjectsService.getApprovedProfessorsForSubject(id);
  }
}
