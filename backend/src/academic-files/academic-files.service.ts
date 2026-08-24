import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicFile } from './academic-file.entity';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';
import { CreateAcademicFileDto } from './dto/create-academic-file.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AcademicFilesService {
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(AcademicFile)
    private readonly academicFileRepository: Repository<AcademicFile>,
    @InjectRepository(ProfessorSubject)
    private readonly professorSubjectRepository: Repository<ProfessorSubject>,
  ) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async create(createAcademicFileDto: CreateAcademicFileDto, file: Express.Multer.File, user: any): Promise<AcademicFile> {
    const { professorSubjectId } = createAcademicFileDto;

    const professorSubject = await this.professorSubjectRepository.findOne({
      where: { id: professorSubjectId },
    });

    if (!professorSubject) {
      throw new BadRequestException('La relación de profesor y materia no existe');
    }

    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;

    const { data, error } = await this.supabase
      .storage
      .from('academic-files')
      .upload(uniqueName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new InternalServerErrorException('Error al subir el archivo a Supabase: ' + error.message);
    }

    const { data: publicUrlData } = this.supabase
      .storage
      .from('academic-files')
      .getPublicUrl(uniqueName);

    const academicFile = this.academicFileRepository.create({
      professorSubject,
      user: { id: user.id },
      fileUrl: publicUrlData.publicUrl,
      sizeKb: Math.round(file.size / 1024),
    });

    return await this.academicFileRepository.save(academicFile);
  }
}
