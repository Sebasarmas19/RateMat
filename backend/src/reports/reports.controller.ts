import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Reportar una reseña o archivo (Botón de pánico)' })
  @ApiResponse({ status: 201, description: 'Reporte registrado exitosamente' })
  async create(@Body() createReportDto: CreateReportDto, @CurrentUser() user: any) {
    return this.reportsService.create(createReportDto, user);
  }
}
