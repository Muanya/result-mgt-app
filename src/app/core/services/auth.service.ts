import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

interface LoginResp { accessToken: string, refreshToken?: string, user: any; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResp>('/api/auth/login', { email, password })
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.accessToken);
      }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}