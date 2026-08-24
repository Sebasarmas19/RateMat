import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewTag } from './review-tag.entity';
import { ReviewVote } from './review-vote.entity';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewTag, ReviewVote, ProfessorSubject])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
