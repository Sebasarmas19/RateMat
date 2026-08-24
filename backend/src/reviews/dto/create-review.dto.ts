import { IsNotEmpty, IsNumber, IsString, IsBoolean, Min, Max, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  professorSubjectId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ValidateIf(o => o.rating === 1 || o.rating === 5 || typeof o.text !== 'undefined')
  @IsNotEmpty({ message: 'El texto de la reseña es obligatorio si la calificación es de 1 o 5 estrellas.' })
  @IsString()
  text?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
