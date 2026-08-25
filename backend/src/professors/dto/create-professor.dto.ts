import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessorDto {
  @ApiProperty({ description: 'Nombre completo del profesor', example: 'Pedro Perez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
