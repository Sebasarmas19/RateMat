import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Report, ReportEntityType } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { Review, ReviewStatus } from '../reviews/review.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createReportDto: CreateReportDto, user: any): Promise<Report> {
    const { entityType, entityId, reason } = createReportDto;

    return this.dataSource.transaction(async (manager) => {
      // Validar si la entidad existe
      if (entityType === ReportEntityType.REVIEW) {
        const review = await manager.findOne(Review, { where: { id: entityId } });
        if (!review) throw new NotFoundException('Reseña no encontrada');
      }

      // Crear el reporte
      const report = manager.create(Report, {
        user: { id: user.id },
        entityType,
        entityId,
        reason,
      });

      try {
        await manager.save(Report, report);
      } catch (error) {
        if (error.code === '23505') {
          throw new BadRequestException('Ya has reportado este contenido.');
        }
        throw error;
      }

      // Contar reportes
      const count = await manager.count(Report, {
        where: { entityType, entityId },
      });

      // Si llega a 3, ocultar automáticamente (D-010 regla de pánico)
      if (count >= 3) {
        if (entityType === ReportEntityType.REVIEW) {
          await manager.update(Review, entityId, { status: ReviewStatus.HIDDEN });
        }
      }

      return report;
    });
  }
}
