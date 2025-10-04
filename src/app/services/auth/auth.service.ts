import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, take, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthResponse, LoginData, RegisterData, UserDetail } from '../../shared/models/shared.model';
import { UserRole } from '../../shared/models/shared.enum';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;

  private user = new BehaviorSubject<UserDetail | null>(null);

  private loggedIn$ = new BehaviorSubject<boolean>(false);

  private userDetailsPromise: Promise<UserDetail | null> | null = null;

  constructor(private apiService: ApiService) { }

  async initApp(): Promise<void> {
    try {
      await this.refresh();
    } catch {
      this.loggedIn$.next(false);
    } finally {
      console.info('AuthService: App initialization complete');
    }
  }


  login(data: LoginData) {
    return this.apiService.login(data.email, data.password)
      .pipe(take(1), tap(res => {
        this.setAuthDetails(res);
      }));
  }


  public get userDetails(): Observable<UserDetail | null> {
    console.log('Getting user details:', this.user.getValue());
    return this.user as Observable<UserDetail | null>;
  }



  private setAuthDetails(res: AuthResponse) {
    console.log('Login response', res);

    if (res?.accessToken) {
      this.accessToken = res.accessToken;
      this.loggedIn$.next(true);
      this.getUserDetails();
    } else {
      console.log('Login failed: No access token received');
      this.loggedIn$.next(false);
    }
  }

  register(data: RegisterData) {
    return this.apiService.register(data)
      .pipe(take(1), tap(res => {
        this.setAuthDetails(res);
      }));
  }

  async refresh(): Promise<void> {
    console.info('Refreshing token...');

    await firstValueFrom(this.apiService.refreshToken<{ accessToken: string }>()).then(res => {
      this.setAuthDetails(res);
    }).catch((err) => {
      console.error('Refresh token failed', err);
      this.loggedIn$.next(false);
    });

  }
  async getUserDetails() {
    if (this.user.getValue() != null) {
      return this.user.getValue();
    }

    if (this.userDetailsPromise) {
      return this.userDetailsPromise;
    }

    this.userDetailsPromise = firstValueFrom(this.apiService.getUserProfile()).then(res => {
      if (res) {
        this.user.next(res);
        return res

      } else {
        this.user.next(null);
        return null;
      }
    }).catch((err) => {
      console.error('Fetching user details failed', err);
    }).finally(() => {
      this.userDetailsPromise = null;
    });

    return this.userDetailsPromise;
  }

  logout(): Observable<any> {
    return this.apiService.logout()
      .pipe(
        take(1),
        tap(() => {
          this.accessToken = null;
          this.loggedIn$.next(false);
          this.user.next(null);
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

  getUserRole(): UserRole | null {
    return this.user.getValue()?.role || null;
  }

}