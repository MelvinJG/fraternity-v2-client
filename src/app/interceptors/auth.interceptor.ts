import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { UserAuthService } from '../services/user-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(UserAuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
        const hasToken = !!localStorage.getItem('token');
        const isSignInRequest = req.url.includes('/signin');
        const isAlreadyInLogin = router.url === '/login';
        if (error.status === 401 && hasToken && !isSignInRequest && !isAlreadyInLogin) {
            Swal.fire({
                icon: 'info',
                title: 'Sesión expirada',
                text: 'Tu sesión venció. Inicia sesión nuevamente.'
            });
            authService.logout();
            router.navigate(['/login']);
        }
        return throwError(() => error);
        })
    );
};