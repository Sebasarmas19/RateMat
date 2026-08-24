import { Controller, Get, Query } from '@nestjs/common';
import { SubjectsService } from './subjects/subjects.service';
import { ProfessorsService } from './professors/professors.service';

@Controller()
export class AppController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly professorsService: ProfessorsService,
  ) {}

  @Get()
  getHello(): string {
    return 'RateMat API is running!';
  }

  @Get('search')
  async search(@Query('q') q: string) {
    if (!q || q.length < 2) {
      return { subjects: [], professors: [] };
    }
    const [subjects, professors] = await Promise.all([
      this.subjectsService.search(q),
      this.professorsService.search(q),
    ]);
    return { subjects, professors };
  }
}
