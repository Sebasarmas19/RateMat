import { IsEnum, IsNotEmpty } from 'class-validator';
import { VoteType } from '../review-vote.entity';

export class VoteReviewDto {
  @IsNotEmpty()
  @IsEnum(VoteType, { message: 'El voto debe ser UP o DOWN' })
  voteType: VoteType;
}
