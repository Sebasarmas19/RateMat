import { IsEnum, IsNotEmpty } from 'class-validator';
import { VoteType } from '../review-vote.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VoteReviewDto {
  @ApiProperty({ description: 'Tipo de voto (UP o DOWN)', enum: VoteType, example: VoteType.UP })
  @IsNotEmpty()
  @IsEnum(VoteType, { message: 'El voto debe ser UP o DOWN' })
  voteType: VoteType;
}
