import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    authService.logout();
    return next(req);
  }

  req = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });


  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.error('Token expirado ou inválido, redirecionando para login');
        authService.logout();
      }

      return throwError(() => err);
    })
  );
};
