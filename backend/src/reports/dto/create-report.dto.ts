import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
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
  reason: string;
}
