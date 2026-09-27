import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ReportEntityType } from '../report.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ description: 'Tipo de entidad a reportar', enum: ReportEntityType, example: ReportEntityType.REVIEW })
  @IsNotEmpty()
  @IsEnum(ReportEntityType)
  entityType: ReportEntityType;

  @ApiProperty({ description: 'ID de la entidad reportada (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  entityId: string;

  @ApiProperty({ description: 'Razón del reporte', example: 'Contiene insultos y acoso' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300, { message: 'El motivo del reporte no puede exceder los 300 caracteres.' })
  reason: string;
}
