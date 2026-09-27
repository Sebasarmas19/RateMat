import { IsNotEmpty, IsNumber, IsString, IsBoolean, Min, Max, IsOptional, IsUUID, ValidateIf, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID de la relación Profesor-Materia (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  professorSubjectId: string;

  @ApiProperty({ description: 'Calificación del 1 al 5', minimum: 1, maximum: 5, example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Texto de la reseña (Obligatorio si calificación es 1 o 5)' })
  @ValidateIf(o => o.rating === 1 || o.rating === 5 || typeof o.text !== 'undefined')
  @IsNotEmpty({ message: 'El texto de la reseña es obligatorio si la calificación es de 1 o 5 estrellas.' })
  @IsString()
  @MaxLength(1000, { message: 'El texto de la reseña no puede exceder los 1000 caracteres.' })
  text?: string;

  @ApiPropertyOptional({ description: 'Si la reseña será anónima', default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
