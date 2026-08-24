import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
})
export class SubjectsModule {}
