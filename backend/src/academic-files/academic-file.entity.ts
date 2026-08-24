import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';

export enum FileStatus {
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN', // Se oculta automáticamente al llegar a 3 reportes (D-010)
}

@Entity('academic_files')
export class AcademicFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProfessorSubject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professor_subject_id' })
  professorSubject: ProfessorSubject;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  fileUrl: string;

  @Column({ type: 'int' })
  sizeKb: number; // Límite de 10MB será validado en el FileInterceptor (D-005)

  @Column({ type: 'int', default: 0 })
  reportCount: number;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.ACTIVE,
  })
  status: FileStatus;

  @CreateDateColumn()
  createdAt: Date;
}
