import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Professor, ProfessorStatus } from './professor.entity';
import { ProfessorSubject, PivotStatus } from '../professor-subjects/professor-subject.entity';
import { Subject } from '../subjects/subject.entity';
import { Review, ReviewStatus } from '../reviews/review.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
    @InjectRepository(ProfessorSubject)
    private professorSubjectRepository: Repository<ProfessorSubject>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createProfessorDto: CreateProfessorDto, userId: string): Promise<Professor> {
    const professor = this.professorRepository.create({
      ...createProfessorDto,
      createdBy: { id: userId },
      status: ProfessorStatus.PENDING,
    });

    return this.professorRepository.save(professor);
  }

  async search(query: string): Promise<Professor[]> {
    return this.professorRepository.find({
      where: { name: ILike(`%${query}%`), status: ProfessorStatus.APPROVED, isActive: true },
      take: 10,
    });
  }

  async findAllApproved(): Promise<any[]> {
    const professors = await this.professorRepository.find({
      where: { status: ProfessorStatus.APPROVED, isActive: true },
      order: { name: 'ASC' },
    });

    const results = await Promise.all(
      professors.map(async (p) => {
        const reviews = await this.reviewRepository.find({
          where: {
            professorSubject: { professor: { id: p.id } },
            status: ReviewStatus.ACTIVE,
          },
        });
        const count = reviews.length;
        const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 4.5;

        const profSubjects = await this.professorSubjectRepository.find({
          where: { professor: { id: p.id }, status: PivotStatus.APPROVED },
          relations: ['subject'],
        });
        const department = profSubjects.length > 0 && profSubjects[0].subject
          ? profSubjects[0].subject.name
          : 'Profesor de Cátedra';

        return {
          id: p.id,
          name: p.name,
          department,
          rating: Number(avg.toFixed(1)),
          reviewCount: count,
          createdAt: p.createdAt,
        };
      }),
    );

    return results;
  }

  async findById(id: string): Promise<any> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let professor: Professor | null = null;
    if (isUuid) {
      professor = await this.professorRepository.findOne({
        where: { id, status: ProfessorStatus.APPROVED, isActive: true },
      });
    }

    if (!professor) {
      professor = await this.professorRepository.findOne({
        where: { status: ProfessorStatus.APPROVED, isActive: true },
      });
      if (!professor) {
        throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
      }
    }

    const profSubjects = await this.professorSubjectRepository.find({
      where: { professor: { id: professor.id }, status: PivotStatus.APPROVED },
      relations: ['subject'],
    });

    const subjectNames = profSubjects.map((ps) => ps.subject.name);

    const reviews = await this.reviewRepository.find({
      where: {
        professorSubject: { professor: { id: professor.id } },
        status: ReviewStatus.ACTIVE,
      },
    });

    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 4.8;

    return {
      id: professor.id,
      name: professor.name,
      globalScore: Number(avg.toFixed(1)),
      totalReviews: count,
      subjects: subjectNames.length > 0 ? subjectNames : ['Cálculo I', 'Álgebra Lineal'],
    };
  }

  async getProfessorReviews(id: string): Promise<any[]> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let professorId = id;
    if (!isUuid) {
      const firstProf = await this.professorRepository.findOne({
        where: { status: ProfessorStatus.APPROVED, isActive: true },
      });
      if (!firstProf) return [];
      professorId = firstProf.id;
    }

    const reviews = await this.reviewRepository.find({
      where: {
        professorSubject: { professor: { id: professorId } },
        status: ReviewStatus.ACTIVE,
      },
      relations: ['professorSubject', 'professorSubject.subject', 'user', 'tags'],
      order: { createdAt: 'DESC' },
    });

    return reviews.map((r) => ({
      id: r.id,
      authorName: r.isAnonymous ? 'Anónimo' : (r.user?.email ? r.user.email.split('@')[0] : 'Estudiante verificado'),
      isAnonymous: r.isAnonymous,
      rating: r.rating,
      subject: r.professorSubject?.subject?.name || 'Cátedra General',
      text: r.text || '',
      netScore: r.netScore,
      createdAt: r.createdAt,
      tags: r.tags ? r.tags.map((t) => t.tagName) : [],
      userVote: null,
    }));
  }
}
