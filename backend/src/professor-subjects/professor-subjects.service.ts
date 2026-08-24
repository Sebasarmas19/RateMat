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
    const relations = await this.professorSubjectRepository.find({
      where: {
        subject: { id: subjectId },
        status: PivotStatus.APPROVED,
        professor: { status: ProfessorStatus.APPROVED },
      },
      relations: ['professor'],
    });
    return relations.map(r => r.professor);
  }
}
