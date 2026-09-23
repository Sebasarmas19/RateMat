import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DailyLimitGuard } from '../auth/daily-limit.guard';
import { Professor } from './professor.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('professors')
@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los profesores aprobados y activos' })
  @ApiResponse({ status: 200, description: 'Lista de profesores aprobados' })
  async findAll() {
    return this.professorsService.findAllApproved();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener información y métricas del perfil de un profesor' })
  @ApiParam({ name: 'id', description: 'ID del profesor', type: 'string' })
  @ApiResponse({ status: 200, description: 'Perfil de profesor devuelto con éxito' })
  async findOne(@Param('id') id: string) {
    return this.professorsService.findById(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Obtener reseñas verificadas asociadas a un profesor' })
  @ApiParam({ name: 'id', description: 'ID del profesor', type: 'string' })
  @ApiResponse({ status: 200, description: 'Lista de reseñas del profesor' })
  async getReviews(@Param('id') id: string) {
    return this.professorsService.getProfessorReviews(id);
  }

  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, DailyLimitGuard(Professor, 3, 'createdBy'))
  @Post()
  @ApiOperation({ summary: 'Sugerir un nuevo profesor (Máx 3 por día)' })
  @ApiResponse({ status: 201, description: 'Profesor sugerido exitosamente en estado PENDING' })
  @ApiResponse({ status: 429, description: 'Límite diario excedido' })
  async create(@Body() createProfessorDto: CreateProfessorDto, @CurrentUser() user: any) {
    return this.professorsService.create(createProfessorDto, user.id);
  }
}
