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
          // return this.autoRefreshToken(req, next);
        }
        return throwError(() => error);
      })
    );


  }

  private autoRefreshToken(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      console.log('Refreshing token 123..');
      
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);


      return this.auth.refresh().then(() => {
        const newToken = this.auth.getAccessToken();
        if (newToken) {
          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addToken(req, newToken));
        } else {
          this.auth.logout();
          return throwError(() => new Error('No new access token'));
        }
      }).catch(err => {
        this.auth.logout();
        return throwError(() => err);
      }).finally(() => {
        this.isRefreshing = false;
      });
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
