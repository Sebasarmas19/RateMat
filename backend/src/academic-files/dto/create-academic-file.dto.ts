import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAcademicFileDto {
  @ApiProperty({ description: 'ID de la relación Profesor-Materia (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  professorSubjectId: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Archivo PDF (máx 10MB)' })
  file: any;
}
