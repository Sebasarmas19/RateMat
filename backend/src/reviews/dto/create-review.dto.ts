import { IsNotEmpty, IsNumber, IsString, IsBoolean, Min, Max, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  professorSubjectId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
