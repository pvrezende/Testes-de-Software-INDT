import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../../shared/services/auth-service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  const isPublicEndpoint =
    req.url.includes('/login') ||
    req.url.includes('/register') ||
    req.url.includes('/refresh');

  if (isPublicEndpoint) {
    return next(req);
  }

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(res => {
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.tokens.tokenAccess}`
              }
            });
            return next(retryReq);
          }),
          catchError(err => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
