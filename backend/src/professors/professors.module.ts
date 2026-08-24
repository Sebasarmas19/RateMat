import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './professor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professor])],
})
export class ProfessorsModule {}
