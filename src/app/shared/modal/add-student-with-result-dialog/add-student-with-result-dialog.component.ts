// add-student-with-result-dialog.component.ts
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UserDetail } from '../../models/shared.model';
import { ApiService } from '../../../services/api/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';



export interface AddStudentWithResultDialogData {
  course: any;
  existingStudents: UserDetail[];
}

@Component({
  selector: 'app-add-student-with-result-dialog',
  templateUrl: './add-student-with-result-dialog.component.html',
  styleUrls: ['./add-student-with-result-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule
  ]
})
export class AddStudentWithResultDialogComponent implements OnInit {
  allStudents: UserDetail[] = [];
  filteredStudents: UserDetail[] = [];
  selectedStudent?: UserDetail;
  isLoading = false;
  searchControl = new FormControl('');

  // Result Form
  gradeControl = new FormControl('', [Validators.required]);
  scoreControl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]);
  remarksControl = new FormControl('');
  enrollmentDateControl = new FormControl(new Date(), [Validators.required]);

  // Grades
  grades = [
    { value: 'A', label: 'A - Excellent (90-100%)' },
    { value: 'B', label: 'B - Good (80-89%)' },
    { value: 'C', label: 'C - Average (70-79%)' },
    { value: 'D', label: 'D - Poor (60-69%)' },
    { value: 'F', label: 'F - Fail (0-59%)' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddStudentWithResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddStudentWithResultDialogData,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAllStudents();
    this.setupSearch();
  }

  loadAllStudents(): void {
    this.isLoading = true;
    this.apiService.getAllStudents().pipe(take(1)).subscribe({
      next: (students) => {
        // Filter out students that are already enrolled in this course
        const existingStudentIds = new Set(this.data.existingStudents.map(s => s.id));
        this.allStudents = students.filter(student => !existingStudentIds.has(student.id));
        this.filteredStudents = this.allStudents;
        this.isLoading = false;
        this.cdRef.detectChanges()
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load students', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges.subscribe(value => {
      this.applyFilter(value || '');
    });
  }

  applyFilter(filterValue: string): void {
    const filter = filterValue.toLowerCase();
    this.filteredStudents = this.allStudents.filter(student =>
      student.firstName.toLowerCase().includes(filter) ||
      student.lastName.toLowerCase().includes(filter) ||
      student.email.toLowerCase().includes(filter) 
      // student.studentId.toLowerCase().includes(filter) ||
      // student.department.toLowerCase().includes(filter)
    );
  }

  selectStudent(student: UserDetail): void {
    this.selectedStudent = student;
  }

  isStudentSelected(student: UserDetail): boolean {
    return this.selectedStudent?.id === student.id;
  }

  getSelectedStudentName(): string {
    return this.selectedStudent ? 
      `${this.selectedStudent.firstName} ${this.selectedStudent.lastName}` : 
      'No student selected';
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  onGradeChange(): void {
    // Auto-fill score based on grade selection
    if (this.gradeControl.value && !this.scoreControl.value) {
      const gradeScores: { [key: string]: number } = {
        'A': 95,
        'B': 85,
        'C': 75,
        'D': 65,
        'F': 45
      };
      this.scoreControl.setValue(gradeScores[this.gradeControl.value].toString());
    }
  }

  onScoreChange(): void {
    // Auto-suggest grade based on score
    if (this.scoreControl.value && !this.gradeControl.value) {
      const score = Number(this.scoreControl.value);
      if (score >= 90) this.gradeControl.setValue('A');
      else if (score >= 80) this.gradeControl.setValue('B');
      else if (score >= 70) this.gradeControl.setValue('C');
      else if (score >= 60) this.gradeControl.setValue('D');
      else this.gradeControl.setValue('F');
    }
  }

  isFormValid(): boolean {
    return !!this.selectedStudent && 
           this.gradeControl.valid && 
           this.scoreControl.valid &&
           this.enrollmentDateControl.valid;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.isFormValid() || !this.selectedStudent) {
      return;
    }

    const resultData = {
      studentId: this.selectedStudent.id,
      courseId: this.data.course.id,
      grade: this.gradeControl.value,
      score: this.scoreControl.value,
      remarks: this.remarksControl.value,
      enrollmentDate: this.enrollmentDateControl.value,
      completed: true
    };

    this.isLoading = true;
    this.apiService.addStudentWithResult(this.data.course.id, resultData).pipe(take(1)).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialogRef.close({
          success: true,
          student: this.selectedStudent,
          result: resultData
        });
      },
      error: (error) => {
        console.error('Error adding student with result:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to add student with result', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  clearSelection(): void {
    this.selectedStudent = undefined;
    this.gradeControl.reset();
    this.scoreControl.reset();
    this.remarksControl.reset();
    this.enrollmentDateControl.setValue(new Date());
  }
}