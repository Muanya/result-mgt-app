import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    const accessToken = this.auth.getAccessToken();

    if (accessToken) {
      authReq = this.addToken(req, accessToken)
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Access token might be expired, try to refresh
          return this.autoRefreshToken(req, next);
        }
        return throwError(() => error);
      })
    );


  }

  private autoRefreshToken(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refresh().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          this.auth.setAccessToken(res.accessToken); 
          this.refreshTokenSubject.next(res.accessToken);
          return next.handle(this.addToken(req, res.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.auth.logout();
          return throwError(() => err);
        })
      );
    } else {
      // Wait until refresh is done, then retry
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }

  addToken(req: HttpRequest<any>, accessToken: any): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }
}
