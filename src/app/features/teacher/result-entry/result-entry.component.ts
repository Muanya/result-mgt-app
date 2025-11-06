import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { take } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from "@angular/material/stepper";
import { UserDetail } from '../../../shared/models/shared.model';
import { NO_ENROLL_INDEX } from '../../../shared/models/shared.constant';

@Component({
  selector: 'app-result-entry',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatStepperModule
  ],
  templateUrl: './result-entry.component.html',
  styleUrl: './result-entry.component.scss'
})
export class ResultEntryComponent implements OnInit {
  @Input() enrollmentId!: number;
  @Input() courseId?: number;
  @Input() students: UserDetail[] = [];

  gradeOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  gradeColumns: string[] = ['studentName', 'marks', 'grade', 'remarks', 'actions'];;
  resultForm!: FormGroup;
  isSubmitting: boolean = false;



  @Output() goBack = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();
  @Output() applyBulkMarksEvent = new EventEmitter<void>();
  @Output() autoCalculateGradesEvent = new EventEmitter<void>();
  @Output() marksChange = new EventEmitter<{ studentId: number, marks: number }>();
  @Output() removeStudent = new EventEmitter<number>();


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.resultForm = this.fb.group({
      results: this.fb.array([]),
    });

    if (this.enrollmentId && this.students.length > 0) {
      this.loadData();
    }
  }



  loadData(): void {

    // Fetch enrollment details to get students
    const resultsArray = this.resultForm.get('results') as FormArray;

    // Clear any previous form controls
    resultsArray.clear();

    const studentIds = this.students.map(s => s.id);

    // Build form with one result input per student
    this.students.forEach(s => {
      resultsArray.push(
        this.fb.group({
          studentId: [s.id],
          score: ['', Validators.required],
          grade: [''],
          remarks: [''],
          id: [null]
        })
      );
    });

    let reqData: any;

    if (this.enrollmentId === NO_ENROLL_INDEX) {
      reqData = { enrollmentId: null, courseId: this.courseId, studentIds: studentIds };

    } else {
      reqData = { enrollmentId: this.enrollmentId, courseId: this.courseId, studentIds: studentIds };
    }


    this.apiService.getResultsByEnrollmentForGivenStudents(reqData).pipe(take(1)).subscribe(existingResults => {
      console.log('Existing results fetched:', existingResults);
      if (existingResults && existingResults.length) {
        const resultsArray = this.resultForm.get('results') as FormArray;
        console.log('Existing result', existingResults);
        existingResults.forEach(er => {
          const studentResultGroup = resultsArray.controls.find(g => g.value.studentId === er.studentId);

          if (studentResultGroup) {
            studentResultGroup.patchValue({
              score: er.score,
              grade: er.grade,
              id: er.id
            });
          }
        });

      }
    });


  }

  get results(): FormArray {
    return this.resultForm.get('results') as FormArray;
  }

  submitResults() {
    if (this.resultForm.valid) {
      this.isSubmitting = true;
      let results = this.resultForm.value.results as any[];
      results.forEach(result => {
        result.enrollmentId = this.enrollmentId;
      });

      console.log('Submitting mass results:', results);
      this.apiService.bulkSaveResults(results).pipe(take(1)).subscribe(() => {
        alert('Results saved for all students 🎉');
      });
      this.isSubmitting = false;
      this.onSubmit.emit();
    }
  }




  onMarksChange(index: number, event: any) {
    const marks = Number(event.target?.value);
    const entry = this.results.at(index);

    if (entry) {
      // Update the marks/score
      entry.get('score')?.setValue(marks);

      // Calculate and update grade, points, status
      const grade = this.calculateGrade(marks);
      entry.get('grade')?.setValue(grade);

      // Trigger change detection
      entry.updateValueAndValidity();
    }
  }

  calculateGrade(marks: number): 'D' | 'N' {
    const passMarks = 85;
    return marks >= passMarks ? 'D' : 'N'
  }


  removeStudentFromGradeEntry(id: number) {
    this.removeStudent.emit(id);
  }



  getNumberPassed() {
    return this.results.controls.filter(control =>
      control.get('grade')?.value === 'D'
    ).length;
  }

  getNumberFailed() {
    return this.results.controls.filter(control =>
      control.get('grade')?.value !== 'D'
    ).length;
  }

  getPassPercentage() {
    const passedCount = this.getNumberPassed();
    const totalCount = this.results.length;
    return totalCount > 0 ? (passedCount / totalCount) * 100 : 0;
  }
  getGradeColor(grade: string): string {
    if (grade === 'A+' || grade === 'A' || grade === 'A-') return 'primary';
    if (grade === 'B+' || grade === 'B' || grade === 'B-') return 'accent';
    if (grade === 'C+' || grade === 'C' || grade === 'C-') return 'warn';
    return 'warn'; // D and F grades
  }

  getStatusColor(status: number): string {
    return status > 80 ? 'chip-primary' : 'chip-warn';
  }

  canSubmit(): boolean {
    // Basic checks
    if (!this.resultForm.valid || this.results.length === 0) {
      return false;
    }

    // Check if all students have marks entered and valid grades
    return this.results.controls.every(control => {
      const score = control.get('score')?.value;
      const grade = control.get('grade')?.value;

      return score !== null &&
        score !== undefined &&
        score !== '' &&
        score >= 0 &&
        score <= 100 &&
        grade !== null &&
        grade !== undefined &&
        grade !== '';
    });
  }
}
