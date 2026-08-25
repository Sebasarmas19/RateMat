import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DailyLimitGuard } from '../auth/daily-limit.guard';
import { Professor } from './professor.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('professors')
@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

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
