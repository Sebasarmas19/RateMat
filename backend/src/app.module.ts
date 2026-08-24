import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { SubjectsModule } from './subjects/subjects.module';
import { ProfessorsModule } from './professors/professors.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Configurable por env luego
      port: 5432,
      username: 'postgres', // Cambiar según el local del usuario
      password: 'root', // Cambiar según el local del usuario
      database: 'ratemat',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo en desarrollo (Tarea 1: que TypeORM sincronice la BD)
    }),
    UsersModule,
    SubjectsModule,
    ProfessorsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
