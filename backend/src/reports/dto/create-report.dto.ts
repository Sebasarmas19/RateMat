import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ReportEntityType } from '../report.entity';

export class CreateReportDto {
  @IsNotEmpty()
  @IsEnum(ReportEntityType)
  entityType: ReportEntityType;

  @IsNotEmpty()
  @IsUUID()
  entityId: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
