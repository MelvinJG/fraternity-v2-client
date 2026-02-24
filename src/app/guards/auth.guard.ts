import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);
  const isLoggedIn = authService.getLoginStatus();

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
