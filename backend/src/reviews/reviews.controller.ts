import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { DailyLimitGuard } from '../auth/daily-limit.guard';
import { Review } from './review.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('recent')
  @ApiOperation({ summary: 'Obtener las reseñas más recientes' })
  @ApiResponse({ status: 200, description: 'Lista de reseñas recientes' })
  async getRecent() {
    return this.reviewsService.getRecentReviews();
  }

  @Post()
  @UseGuards(SupabaseAuthGuard, DailyLimitGuard(Review, 10, 'user'))
  @ApiOperation({ summary: 'Crear una nueva reseña (Máx 10 por día)' })
  @ApiResponse({ status: 201, description: 'Reseña creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Contiene lenguaje inapropiado o datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya has reseñado este profesor en esta materia' })
  @ApiResponse({ status: 429, description: 'Límite diario de reseñas excedido' })
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Post(':id/vote')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Votar positiva o negativamente una reseña' })
  @ApiParam({ name: 'id', description: 'ID de la reseña', type: 'string' })
  @ApiResponse({ status: 201, description: 'Voto registrado o actualizado exitosamente' })
  async vote(
    @Param('id') id: string,
    @Body() voteReviewDto: VoteReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.vote(id, voteReviewDto, user);
  }
}
