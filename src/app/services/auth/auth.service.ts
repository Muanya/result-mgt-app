import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { ApiService } from '../api/api.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;

  private loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) { }


  login(email: string, password: string) {
    return this.apiService.login(email, password)
      .pipe(take(1), tap(res => {
        if (res?.accessToken) {
          this.accessToken = res.accessToken;
          this.loggedIn$.next(true);
        }
      }));
  }


  refresh(): Observable<any> {
    return this.apiService.refreshToken<{ accessToken: string }>()
      .pipe(
        take(1),
        tap(res => {
          this.accessToken = res.accessToken;
        })
      );
  }

  logout(): Observable<any> {
    return this.apiService.logout()
      .pipe(
        take(1),
        tap(() => {
          this.accessToken = null;
          this.loggedIn$.next(false);
        })
      );
  }


  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
}