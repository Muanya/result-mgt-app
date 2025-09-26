import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { catchError, forkJoin, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { MatLineModule } from '@angular/material/core';

@Component({
  selector: 'app-course-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  courseId!: number;
  private destroy$ = new Subject<void>();


  // enrollments: { name: string, date: Date }[] = [

  // ];

  // course: {
  //   title?: string;
  //   code?: string;
  //   creditUnit?: number;
  // } = {
  //     title: '', code: '', creditUnit: 0
  //   };



  // completedStudents: {
  //   id: number,
  //   name: string
  // }[] = [

  //   ];

  // notCompletedStudents: {
  //   id: number,
  //   name: string,
  // }[] = [

  //   ];

  courseData$!: Observable<{
    course: any;
    enrollments: any[];
    completedStudents: any[];
    notCompletedStudents: any[];
  }>;


  constructor(private apiService: ApiService, private route: ActivatedRoute) { }



  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourseDetails();
  }

  loadCourseDetails() {
    this.courseData$ = forkJoin({
      course: this.apiService.getCourseById(this.courseId).pipe(
        catchError(err => {
          console.error('Error fetching course:', err);
          return of(null);
        })
      ),
      enrollments: this.apiService.getCourseEnrollmentByCourseId(this.courseId).pipe(
        map(res => res.map(e => ({
          name: e.enrollmentClassName,
          date: new Date(e.startDate)
        }))),
        catchError(err => {
          console.error('Error fetching enrollments:', err);
          return of([]);
        })
      ),
      completedStudents: this.apiService.getStudentsByCourseId(this.courseId).pipe(
        map(res => res.map(s => ({
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
          grade: 'D'
        }))),
        catchError(err => {
          console.error('Error fetching completed students:', err);
          return of([]);
        })
      ),
      allStudents: this.apiService.getAllStudents().pipe(
        map(res => res.map(s => ({
          id: s.id,
          name: `${s.firstName} ${s.lastName}`
        }))),
        catchError(err => {
          console.error('Error fetching all students:', err);
          return of([]);
        })
      )
    }).pipe(
      map(({ course, enrollments, completedStudents, allStudents }) => ({
        course,
        enrollments,
        completedStudents,
        notCompletedStudents: allStudents.filter(
          s => !completedStudents.some(cs => cs.id === s.id)
        )
      })),
      tap(data => console.log('Course data:', data)), // Instead of subscribe console.log
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getGradeColor(grade: string): string {
    if (grade.startsWith('A')) return 'primary';
    if (grade.startsWith('B')) return 'accent';
    return 'warn';
  }
}
