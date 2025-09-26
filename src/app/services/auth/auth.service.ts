import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, take, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { LoginData, RegisterData } from '../../shared/models/shared.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;

  private loggedIn$ = new BehaviorSubject<boolean | null>(null);

  constructor(private apiService: ApiService) {

  }

  async initApp(): Promise<void> {
    try {
      await this.refresh();
      // this.loggedIn$.next(true);
    } catch {
      console.log('No valid session found during app initialization');
      
      this.loggedIn$.next(false);
    } finally {
      console.log('AuthService: App initialization complete');

    }
  }


  login(data: LoginData) {
    return this.apiService.login(data.email, data.password)
      .pipe(take(1), tap(res => {
        if (res?.accessToken) {
          this.accessToken = res.accessToken;
          this.loggedIn$.next(true);
        } else {
          console.log('Login failed: No access token received');
          
          this.loggedIn$.next(false);
        }
      }));
  }


  register(data: RegisterData) {
    return this.apiService.register(data)
      .pipe(take(1), tap(res => {
        if (res?.accessToken) {
          this.accessToken = res.accessToken;
          this.loggedIn$.next(true);
        } else {
          this.loggedIn$.next(false);
        }
      }));
  }

  async refresh(): Promise<void> {
    console.log('Refreshing token...');

    await firstValueFrom(this.apiService.refreshToken<{ accessToken: string }>()).then(res => {      
      if (res?.accessToken) {
        this.accessToken = res.accessToken;
        this.loggedIn$.next(true);
      } else {        
        this.loggedIn$.next(false);
      }
    }).catch((err) => { 
      console.log('Refresh token failed', err);
      this.loggedIn$.next(null);
    });

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

  isLoggedIn(): Observable<boolean | null> {
    return this.loggedIn$.asObservable();
  }
}