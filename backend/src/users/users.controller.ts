import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Obtener o registrar al usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario devuelto exitosamente' })
  async getMe(@CurrentUser() user: any) {
    // Busca o crea al usuario en nuestra BD local la primera vez que hace login
    const dbUser = await this.usersService.findOrCreate(user.id, user.email);
    return dbUser;
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('accept-terms')
  @ApiOperation({ summary: 'Registrar la aceptación de términos y políticas (D-010)' })
  @ApiResponse({ status: 200, description: 'Términos aceptados y registrados con timestamp' })
  async acceptTerms(@CurrentUser() user: any) {
    return this.usersService.acceptTerms(user.id, user.email);
  }
}
