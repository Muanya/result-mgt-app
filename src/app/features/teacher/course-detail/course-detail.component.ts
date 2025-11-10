import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { take } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseDetail, EnrollmentDetail, UserDetail } from '../../../shared/models/shared.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from "../../../shared/modal/loader/loader.component";
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SingleResultModalComponent } from '../../../shared/modal/single-result-modal/single-result-modal.component';
import { AddStudentWithResultDialogComponent } from '../../../shared/modal/add-student-with-result-dialog/add-student-with-result-dialog.component';
import { ScoreDetailsData, ScoreDetailsDialogComponent } from '../../../shared/modal/score-details-dialog/score-details-dialog.component';

@Component({
  selector: 'app-course-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    LoaderComponent
],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})

export class CourseDetailComponent implements OnInit {
  course?: CourseDetail;
  students: UserDetail[] = [];
  enrollments: EnrollmentDetail[] = [];
  filteredStudents: UserDetail[] = [];
  isLoading = false;
  isEditMode = false;
  activeTab = 'overview';

  // Edit Form
  courseTitleControl = new FormControl('', [Validators.required]);

  // Filter properties
  completionFilter: 'all' | 'completed' | 'ongoing' = 'all';
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCourseDetails();
  }

  loadCourseDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isLoading = true;
      this.apiService.getCourseById(id).pipe(take(1)).subscribe({
        next: (course) => {
          console.log('course', course);
          
          this.course = course;
          this.courseTitleControl.setValue(course.title);
          this.loadCourseStudents(id);
          this.loadCourseEnrollments(id);
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load course details', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  loadCourseStudents(courseId: number): void {
    this.apiService.getStudentsByCourseId(courseId).pipe(take(1)).subscribe({
      next: (students) => {
        this.students = students;
        this.filteredStudents = this.students;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.snackBar.open('Failed to load student data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadCourseEnrollments(courseId: number): void {
    this.apiService.getCourseEnrollmentByCourseId(courseId).pipe(take(1)).subscribe({
      next: (enrollments) => {
        console.log(enrollments);
        
        this.enrollments = enrollments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load enrollment data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Cancel edit mode
      this.courseTitleControl.setValue(this.course?.title || '');
      this.isEditMode = false;
    } else {
      this.isEditMode = true;
    }
  }

  saveCourse(): void {
    if (this.courseTitleControl.invalid || !this.course) {
      return;
    }

    const updatedCourse = {
      ...this.course,
      title: this.courseTitleControl.value
    };

    this.isLoading = true;
    this.apiService.updateCourse(this.course.id, updatedCourse).pipe(take(1)).subscribe({
      next: (course) => {
        this.course = course;
        this.isEditMode = false;
        this.isLoading = false;
        this.snackBar.open('Course updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error updating course:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to update course', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onStudentClick(student: UserDetail): void {
    // Open student detail dialog (to be implemented later)
      // const dialogRef = this.dialog.open(ScoreDetailsDialogComponent, {
      //     width: '600px',
      //     maxWidth: '95vw',
      //     maxHeight: '90vh',
      //     data: {
      //       student: student,
        //     subjectId: subjectId.toString(),
        //     subject: subject,
        //     grade: score
        //   } as ScoreDetailsData
        // });
    
        // dialogRef.afterClosed().subscribe(result => {
        //   if (result === 'view-report') {
        //     // Navigate to full student report page
        //     // this.router.navigate(['/student-report', student.studentId]);
        //   }
        // });
  }

  onAddResult(student: UserDetail): void {
    if (!this.course) return;

    const dialogRef = this.dialog.open(SingleResultModalComponent, {
      width: '500px',
      data: {
        sId: student.id, 
        // eId: this.enrollment?.id, fix this
        firstName: student.firstName,
        lastName: student.lastName,
      },
    
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourseStudents(this.course!.id);
        this.snackBar.open('Result added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  onAddStudent(): void {
    if (!this.course) return;

    const dialogRef = this.dialog.open(AddStudentWithResultDialogComponent, {
      width: '600px',
      data: {
        course: this.course,
        existingStudents: this.students
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourseStudents(this.course!.id);
        this.snackBar.open('Student added with result successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      // Search filter
      const matchesSearch = !this.searchTerm || 
        student.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) 

      return matchesSearch;
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  onCompletionFilterChange(filter: 'all' | 'completed' | 'ongoing'): void {
    this.completionFilter = filter;
    this.applyFilters();
  }

  getCompletionStats(): { total: number, completed: number, ongoing: number } {
    const total = this.students.length;
    const completed = 0
    const ongoing = total - completed;
    return { total, completed, ongoing };
  }

  getGradeColor(grade: string): string {
    const gradeMap: { [key: string]: string } = {
      'A': 'grade-excellent',
      'B': 'grade-good',
      'C': 'grade-average',
      'D': 'grade-poor',
      'F': 'grade-fail'
    };
    return gradeMap[grade] || 'grade-default';
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  viewEnrollment(enrollment: EnrollmentDetail): void {
    this.router.navigate(['/teacher/enrollments', enrollment.id]);
  }
}
