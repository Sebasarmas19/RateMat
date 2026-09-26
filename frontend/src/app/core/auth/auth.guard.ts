import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser() || authService.hasActiveSession()) {
    return true;
  }

  // Redirigir a landing si no está autenticado
  return router.parseUrl('/');
};

export const landingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya inició sesión previamente o tiene sesión activa, va directo al buscador
  if (authService.hasActiveSession()) {
    return router.parseUrl('/search');
  }

  return true;
};
