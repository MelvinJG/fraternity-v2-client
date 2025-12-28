import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);
  const isLoggedIn = authService.getLoginStatus();

  if (!isLoggedIn) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Inicie Sesión"
    });
    router.navigate(['/login']);
    return false;
  }

  return true;
};
