import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('SUPABASE_JWT_SECRET');
    if (!secret && process.env['NODE_ENV'] === 'production') {
      throw new Error('FATAL: SUPABASE_JWT_SECRET must be defined in production.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'super-secret-jwt-key-from-supabase-replace-me-in-prod',
    });
  }

  async validate(payload: any) {
    const email = (payload?.email || '').toLowerCase().trim();
    const isUcabStudent = email.endsWith('@est.ucab.edu.ve');
    const isUcabStaff = email.endsWith('@ucab.edu.ve');

    if (!isUcabStudent && !isUcabStaff) {
      throw new UnauthorizedException('Acceso restringido: El correo debe pertenecer al dominio institucional (@est.ucab.edu.ve o @ucab.edu.ve)');
    }

    return { id: payload.sub, email };
  }
}
