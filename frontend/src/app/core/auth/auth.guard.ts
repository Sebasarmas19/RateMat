import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasActiveSession()) {
    return true;
  }

  // Redirigir a /login si no está autenticado, preservando la URL de destino solicitada
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const landingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya tiene sesión activa y navega explícitamente a /login, redirigirlo a /search
  if (route.routeConfig?.path === 'login' && authService.hasActiveSession()) {
    return router.parseUrl('/search');
  }

  return true;
};
