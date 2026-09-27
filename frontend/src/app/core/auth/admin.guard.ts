import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserRole() === 'admin') {
    return true;
  }

  // Redirigir a la vista principal si no cuenta con privilegios de moderación
  return router.parseUrl('/search');
};
