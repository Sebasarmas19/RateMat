import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Professor } from '../professors/professor.entity';
import { Subject } from '../subjects/subject.entity';

export enum PivotStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

@Entity('professor_subjects')
export class ProfessorSubject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Professor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'professor_id' })
  professor: Professor;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  // Aplica la lógica de Cold Start: si un alumno agrega una materia a un profesor existente, 
  // esta relación debe ser aprobada primero (D-004)
  @Column({
    type: 'enum',
    enum: PivotStatus,
    default: PivotStatus.PENDING,
  })
  status: PivotStatus;
}
