import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DailyLimitGuard } from '../auth/daily-limit.guard';
import { Professor } from './professor.entity';

@Controller('professors')
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @UseGuards(SupabaseAuthGuard, DailyLimitGuard(Professor, 3, 'createdBy'))
  @Post()
  async create(@Body() createProfessorDto: CreateProfessorDto, @CurrentUser() user: any) {
    return this.professorsService.create(createProfessorDto, user.id);
  }
}
