import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { DailyLimitGuard } from '../auth/daily-limit.guard';
import { Report } from './report.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, DailyLimitGuard(Report, 5, 'user'))
  @ApiOperation({ summary: 'Reportar una reseña (Máximo 5 reportes diarios por estudiante)' })
  @ApiResponse({ status: 201, description: 'Reporte registrado exitosamente' })
  @ApiResponse({ status: 429, description: 'Límite diario de reportes alcanzado' })
  async create(@Body() createReportDto: CreateReportDto, @CurrentUser() user: any) {
    return this.reportsService.create(createReportDto, user);
  }
}
