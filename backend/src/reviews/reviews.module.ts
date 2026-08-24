import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewTag } from './review-tag.entity';
import { ReviewVote } from './review-vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewTag, ReviewVote])],
})
export class ReviewsModule {}
