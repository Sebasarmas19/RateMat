import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  // El ID vendrá de Supabase (UUID), por ende usamos PrimaryColumn en lugar de PrimaryGeneratedColumn
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  reputation: number;

  @Column({ default: false })
  terms_accepted: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  terms_accepted_at: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
