import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, RegisterData } from '../../shared/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8080';


  constructor(private http: HttpClient) { }

  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { withCredentials: true });
  }

  postData(endpoint: string, body?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, { withCredentials: true });
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.postData('v1/auth/register', data) as Observable<AuthResponse>;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    var body = { email, password };
    return this.postData('v1/auth/login', body) as Observable<AuthResponse>;
  }

  logout(): Observable<AuthResponse> {
    return this.postData('v1/auth/logout') as Observable<AuthResponse>;
  }

  refreshToken<T>() {
    return this.postData('v1/auth/refresh') as Observable<AuthResponse>;
  }

}
