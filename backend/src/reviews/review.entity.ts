import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  HIDDEN = 'HIDDEN',
}

@Entity('reviews')
@Unique(['user', 'professorSubject']) // Regla Anti-Spam (D-003): 1 Alumno = 1 Reseña por Materia/Profesor
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ProfessorSubject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professor_subject_id' })
  professorSubject: ProfessorSubject;

  @Column({ type: 'int' })
  rating: number; // 1 a 5 estrellas

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column({ type: 'int', default: 0 })
  netScore: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 1.00 })
  weight: number;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.ACTIVE,
  })
  status: ReviewStatus;

  @CreateDateColumn()
  createdAt: Date;
}
