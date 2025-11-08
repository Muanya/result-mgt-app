
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ResultEntryComponent } from "../result-entry/result-entry.component";
import { ApiService } from '../../../services/api/api.service';
import { firstValueFrom, take } from 'rxjs';
import { CourseDetail, EnrollmentDetail, UserDetail } from '../../../shared/models/shared.model';
import { NO_ENROLL_INDEX, NO_ENROLLMENT_OPTION } from '../../../shared/models/shared.constant';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-result-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ResultEntryComponent
  ],
  templateUrl: './result-detail.component.html',
  styleUrl: './result-detail.component.scss'
})
export class ResultDetailComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  courseForm: FormGroup;

  // Data sources
  studentsDataSource: MatTableDataSource<UserDetail>;
  selection = new SelectionModel<UserDetail>(true, []);

  // Display columns
  displayedColumns: string[] = ['select', 'studentId', 'name',];

  noEnrollmentOption: EnrollmentDetail = NO_ENROLLMENT_OPTION
  // Sample data
  courses: CourseDetail[] = [];

  enrollments: EnrollmentDetail[] = [];

  students: UserDetail[] = [];

  // State variables
  selectedCourse: CourseDetail | null = null;
  selectedEnrollment: EnrollmentDetail | null = null;
  currentStep = 1;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private cd: ChangeDetectorRef
  ) {
    this.courseForm = this.createCourseForm();
    this.studentsDataSource = new MatTableDataSource(this.students);
  }

  ngOnInit() {

    this.apiService.getAllCourses().pipe(take(1)).subscribe(data => {
      this.courses = data;
      this.cd.detectChanges();
    });


  }

  setupFormListeners() {
    this.courseForm.get('course')?.valueChanges.subscribe(courseId => {
      this.selectedCourse = this.courses.find(c => c.id === courseId) || null;
      if (this.selectedCourse) {
        this.apiService.getCourseEnrollmentByCourseId(this.selectedCourse.id).pipe(take(1)).subscribe(data => {
          this.enrollments = data;
          this.enrollments.push(this.noEnrollmentOption);
          this.cd.detectChanges();
        });
      }
    });

    this.courseForm.get('enrollment')?.valueChanges.subscribe(enrollmentId => {
      this.selectedEnrollment = this.enrollments.find(s => s.id === enrollmentId) || null;
    });
  }

  ngAfterViewInit() {
    this.setupFormListeners();

    this.studentsDataSource.paginator = this.paginator;
    this.studentsDataSource.sort = this.sort;
  }

  createCourseForm(): FormGroup {
    return this.fb.group({
      course: ['', Validators.required],
      enrollment: ['', Validators.required],
    });
  }



  getTotalStudentsForEnrollment(): number {
    return this.selectedEnrollment ? this.selectedEnrollment.students.length : 0;
  }

  getInstructorsForEnrollment(): string {
    if (this.selectedEnrollment && this.selectedEnrollment.magisters?.length) {
      return this.selectedEnrollment.magisters
        .map((magister: UserDetail) => `${magister.firstName} ${magister.lastName}`)
        .join(', ');
    }
    return '';
  }





  // Step navigation
  nextStep() {
    if (this.currentStep === 1 && this.courseForm.valid) {
      this.currentStep = 2;
      this.loadStudentsForCourse();
    } else if (this.currentStep === 2 && this.selection.hasValue()) {
      this.currentStep = 3;

    }
  }

  previousStep(stepper: any) {


    stepper.previous();

    if (this.currentStep > 1) {
      this.currentStep--;
      stepper.selectedIndex = this.currentStep - 1;
    }
  }

  // Student management
  async loadStudentsForCourse() {
    if(this.selectedEnrollment && this.selectedEnrollment.id === NO_ENROLL_INDEX) {
      this.students = [];
     const data = await firstValueFrom( this.apiService.getAllStudentsByArgs(this.selectedCourse?.id))
      this.students = data;
      this.studentsDataSource.data = this.students;
      return;
    }
    this.students = this.selectedEnrollment ? this.selectedEnrollment.students : [];
    this.studentsDataSource.data = this.students;
  }

  // Selection methods
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentsDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.studentsDataSource.data);
  }



  // Validation
  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.courseForm.valid;
      case 2:
        return this.selection.hasValue();
      default:
        return false;
    }
  }



  showSuccessMessage() {
    this.snackBar.open('Results submitted successfully!', 'View Results', {
      duration: 5000,
      panelClass: ['success-snackbar']
    }).onAction().subscribe(() => {
      // Navigate to results view
      console.log('Navigate to results view');
    });
  }

  // Utility methods
  getAvatarColor(name: string): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getStudentAvatar(student: UserDetail): string {
    if (student.firstName && student.lastName) {
      return student.firstName.charAt(0).toUpperCase() + student.lastName.charAt(0).toUpperCase();
    }
    return '';
  }


  // Filtering
  applyStudentFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.studentsDataSource.filter = filterValue.trim().toLowerCase();
  }

  // Form getters for template
  get courseField() {
    return this.courseForm.get('course');
  }

  get enrollmentField() {
    return this.courseForm.get('enrollment');
  }

}
