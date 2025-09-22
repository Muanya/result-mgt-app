import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../../shared/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
    constructor(private http: HttpClient) {}

  getStudents(query?: { page?: number; size?: number; search?: string }) {
    let params = new HttpParams();
    if (query?.page) params = params.set('page', query.page.toString());
    if (query?.size) params = params.set('size', query.size.toString());
    if (query?.search) params = params.set('search', query.search);
    return this.http.get<{ data: Student[], total: number }>('/api/students', { params });
  }

  create(student: Student) { return this.http.post('/api/students', student); }
  update(id: number, student: Partial<Student>) { return this.http.put(`/api/students/${id}`, student); }
  delete(id: number) { return this.http.delete(`/api/students/${id}`); }
}
