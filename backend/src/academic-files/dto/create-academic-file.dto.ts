import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAcademicFileDto {
  @IsNotEmpty()
  @IsUUID()
  professorSubjectId: string;
}
