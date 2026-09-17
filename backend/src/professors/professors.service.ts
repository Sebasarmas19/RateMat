import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Professor, ProfessorStatus } from './professor.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';

@Injectable()
export class ProfessorsService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
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
}
