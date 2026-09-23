import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';

export enum ReportEntityType {
  REVIEW = 'REVIEW',
}

@Entity('reports')
@Unique(['user', 'entityType', 'entityId']) // Un alumno solo puede reportar una misma entidad una vez
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ReportEntityType,
  })
  entityType: ReportEntityType;

  @Column('uuid')
  entityId: string;

  @Column()
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
