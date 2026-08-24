import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { DailyLimitGuard } from '../auth/daily-limit.guard';
import { Review } from './review.entity';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, DailyLimitGuard(Review, 10, 'user'))
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Post(':id/vote')
  @UseGuards(SupabaseAuthGuard)
  async vote(
    @Param('id') id: string,
    @Body() voteReviewDto: VoteReviewDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewsService.vote(id, voteReviewDto, user);
  }
}
