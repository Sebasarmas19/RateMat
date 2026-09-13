import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async search(query: string): Promise<Subject[]> {
    return this.subjectsRepository.find({
      where: [
        { name: ILike(`%${query}%`) },
        { code: ILike(`%${query}%`) },
      ],
      take: 10,
    });
  }

  async findOne(id: string): Promise<Subject | null> {
    return this.subjectsRepository.findOneBy({ id });
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectsRepository.find();
  }
}
