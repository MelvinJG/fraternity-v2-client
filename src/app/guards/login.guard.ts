import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);
  const isLoggedIn = authService.getLoginStatus();
  /*
    Este guard hace lo contrario de un guard de autenticación
    típico. Está diseñado para proteger la página de login y 
    evitar que usuarios ya autenticados accedan a ella.
  */
  if (isLoggedIn) {
    // Si ya está logueado, redirigir al home
    router.navigate(['/home']);
    return false; // Bloquear acceso a login
  }
  
  return true; // Permitir acceso a login
};
