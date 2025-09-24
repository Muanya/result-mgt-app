import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../services/api/api.service';
import { CourseDetail, UserDetail } from '../../../shared/models/shared.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-enrollment',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-enrollment.component.html',
  styleUrl: './create-enrollment.component.scss'
})



export class CreateEnrollmentComponent implements OnInit {
  enrollmentForm!: FormGroup;

  courses: CourseDetail[] = [];
  students: UserDetail[] = [];
  magisters: UserDetail[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {

  }

  ngOnInit(): void {

    this.enrollmentForm = this.fb.group({
      course: ['', Validators.required],
      enrollmentName: ['', Validators.required],
      students: [[], Validators.required],
      magisters: [[], Validators.required],
      enrollmentDate: ['', Validators.required]
    });


    // Load dropdown data from backend
    this.apiService.getAllCourses().pipe(take(1)).subscribe(data => this.courses = data);
    this.apiService.getAllStudents().pipe(take(1)).subscribe(data => this.students = data);
    this.apiService.getAllMagisters().pipe(take(1)).subscribe(data => this.magisters = data);

    // Auto-populate enrollmentName when course changes
    this.enrollmentForm.get('course')?.valueChanges.subscribe(courseId => {
      const selectedCourse = this.courses.find(c => c.id === courseId);
      if (selectedCourse) {
        const year = new Date().getFullYear();
        const defaultName = `Class of ${selectedCourse.title} ${year}`;
        this.enrollmentForm.patchValue({ enrollmentName: defaultName }, { emitEvent: false });
      }
    });

  }

  onSubmit() {
    if (this.enrollmentForm.valid) {
      console.log('Enrollment Data:', this.enrollmentForm.value);
      let payload = {
        courseId: this.enrollmentForm.value.course,
        enrollmentClassName: this.enrollmentForm.value.enrollmentName,
        studentIds: this.enrollmentForm.value.students,
        magisterIds: this.enrollmentForm.value.magisters,
        startDate: this.enrollmentForm.value.enrollmentDate
      };
      console.log('Payload:', payload);
      // Submit to backend
      this.apiService.createEnrollment(payload).pipe(take(1)).subscribe(() => { 
         alert('Enrollment Created Successfully 🎉');
      });
     
    }
  }

  getMagisterName(id: number): string {
    const magister = this.magisters.find(l => l.id === id);
    return magister ? `${magister.firstName} ${magister.lastName}` : '';
  }

  getStudentName(id: number): string {
    const student = this.students.find(s => s.id === id);
    return student ? `${student.firstName} ${student.lastName}` : '';
  }

  getCourseTitle(id: number): string {
    const course = this.courses.find(c => c.id === id);
    return course ? `${course.code} --> ${course.title}` : '';
  }

}
