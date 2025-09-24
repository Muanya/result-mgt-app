import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../../shared/models/shared.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
    constructor() {}


  // create(student: Student) { return this.http.post('/api/students', student); }
  // update(id: number, student: Partial<Student>) { return this.http.put(`/api/students/${id}`, student); }
  // delete(id: number) { return this.http.delete(`/api/students/${id}`); }
}
