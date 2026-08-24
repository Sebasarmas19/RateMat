import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../users/user.entity';

export enum VoteType {
  UP = 'UP',     // Estoy de acuerdo
  DOWN = 'DOWN', // No estoy de acuerdo
}

@Entity('review_votes')
@Unique(['user', 'review']) // Regla Anti-Spam (D-003): 1 Alumno = 1 Voto Comunitario por Reseña
export class ReviewVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  voteType: VoteType;

  @CreateDateColumn()
  createdAt: Date;
}
