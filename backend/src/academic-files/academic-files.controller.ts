import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AcademicFilesService } from './academic-files.service';
import { CreateAcademicFileDto } from './dto/create-academic-file.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('academic-files')
@ApiBearerAuth()
@Controller('academic-files')
export class AcademicFilesController {
  constructor(private readonly academicFilesService: AcademicFilesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Subir un archivo PDF al hub académico' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo PDF y datos del archivo',
    type: CreateAcademicFileDto,
  })
  @ApiResponse({ status: 201, description: 'Archivo subido y registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o de tamaño mayor a 10MB' })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf' && extname(file.originalname).toLowerCase() === '.pdf') {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten archivos PDF'), false);
      }
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAcademicFileDto: CreateAcademicFileDto,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo PDF es requerido');
    }
    return this.academicFilesService.create(createAcademicFileDto, file, user);
  }
}
