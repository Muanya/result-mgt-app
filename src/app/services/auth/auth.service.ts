import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LoginData, RegisterData } from '../../shared/models/student.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;

  private loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) { }


  login(data: LoginData) {
    return this.apiService.login(data.email, data.password)
      .pipe(take(1), tap(res => {
        if (res?.accessToken) {
          this.accessToken = res.accessToken;
          this.loggedIn$.next(true);
        }
      }));
  }


  register(data: RegisterData) {
    return this.apiService.register(data)
      .pipe(take(1), tap(res => {
        if (res?.accessToken) {
          this.accessToken = res.accessToken;
          this.loggedIn$.next(true);
        }
      }));
  }

  refresh(): Observable<any> {
    console.log('Refreshing token...');
    
    return this.apiService.refreshToken<{ accessToken: string }>()
      .pipe(
        take(1),
        tap(res => {
          this.accessToken = res.accessToken;
          this.loggedIn$.next(true);
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