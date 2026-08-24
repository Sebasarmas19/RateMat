import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { SubjectsModule } from './subjects/subjects.module';
import { ProfessorsModule } from './professors/professors.module';
import { ProfessorSubjectsModule } from './professor-subjects/professor-subjects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AcademicFilesModule } from './academic-files/academic-files.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Configurable por env luego
      port: 5432,
      username: 'postgres',
      password: 'gomitas', // ¡Encontramos la contraseña!
      database: 'ratemat',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo en desarrollo (Tarea 1: que TypeORM sincronice la BD)
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    ProfessorsModule,
    ProfessorSubjectsModule,
    ReviewsModule,
    AcademicFilesModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
