import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorSubject, PivotStatus } from './professor-subject.entity';
import { ProfessorStatus } from '../professors/professor.entity';

@Injectable()
export class ProfessorSubjectsService {
  constructor(
    @InjectRepository(ProfessorSubject)
    private professorSubjectRepository: Repository<ProfessorSubject>,
  ) {}

  async getApprovedProfessorsForSubject(subjectId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subjectId);
    if (!isUuid) {
      return [];
    }

    const relations = await this.professorSubjectRepository.find({
      where: {
        subject: { id: subjectId },
        status: PivotStatus.APPROVED,
        professor: { status: ProfessorStatus.APPROVED, isActive: true },
      },
      relations: ['professor'],
    });
    return relations.map(r => r.professor);
  }
}
