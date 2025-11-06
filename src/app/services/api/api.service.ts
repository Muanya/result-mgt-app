import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, RegisterData } from '../../shared/models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8080';


  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }


  getData(endpoint: string, params?: HttpParams): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders(), withCredentials: true, params });
  }

  postData(endpoint: string, body?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, { headers: this.getHeaders(), withCredentials: true });
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
    return this.postData('v1/auth/refresh', {}) as Observable<AuthResponse>;
  }

  getUserProfile(): Observable<any> {
    return this.getData('v1/auth/me') as Observable<any>;
  }

  getAllCourses(): Observable<any[]> {
    return this.getData('api/courses');
  }

  getAllStudents(): Observable<any[]> {
    let params = new HttpParams();
    // if (query?.page) params = params.set('page', query.page.toString());
    // if (query?.size) params = params.set('size', query.size.toString());
    // if (query?.search) params = params.set('search', query.search);
    return this.getData('api/students');
  }

  getAllStudentsByArgs(courseId?: number, enrollmentId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (courseId) params = params.set('courseId', courseId.toString());
    if (enrollmentId) params = params.set('enrollmentId', enrollmentId.toString());
    return this.getData('api/students', params);
  }

  getStudentById(id: number): Observable<any> {
    return this.getData(`api/students/${id}`);
  }

  getAllMagisters(): Observable<any[]> {
    return this.getData('api/magisters');
  }

  createEnrollment(enrollment: any): Observable<any> {
    return this.postData('api/courses/enroll', enrollment);
  }

  getEnrollmentById(id: number): Observable<any> {
    return this.getData(`api/courses/enrollment/${id}`);
  }

  saveResult(result: any): Observable<any> {
    return this.postData('api/results', result);
  }

  bulkSaveResults(results: any[]): Observable<any> {
    return this.postData('api/results/bulk', results);
  }

  getResultsByEnrollmentForGivenStudents(reqData: { enrollmentId?: number, courseId?: number, studentIds: number[] }): Observable<any[]> {
    return this.postData(`api/results/enrollment`, reqData);
  }

  getResultsByEnrollment(enrollmentId?: number, courseId?: number): Observable<any[]> {
    let params = new HttpParams()
    if (courseId) params = params.set('courseId', courseId.toString());
    if (enrollmentId) params = params.set('enrollmentId', enrollmentId.toString());
    return this.getData(`api/results/enrollment`, params);
  }

  getResultsByStudent(studentId: number): Observable<any[]> {
    return this.getData(`api/results/student/${studentId}`);
  }
  getCourseById(id: number): Observable<any> {
    return this.getData(`api/courses/key/${id}`);
  }

  getCourseEnrollmentByCourseId(courseId: number): Observable<any[]> {
    return this.getData(`api/courses/enrollmentsByCourse/${courseId}`);
  }

  getStudentsByCourseId(courseId: number): Observable<any[]> {
    return this.getData(`api/courses/studentsByCourse/${courseId}`);
  }


}
