import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { take } from 'rxjs';

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
  ],
  templateUrl: './result-entry.component.html',
  styleUrl: './result-entry.component.scss'
})
export class ResultEntryComponent implements OnInit {
  enrollmentId!: number;
  students: any[] = [];
  resultForm!: FormGroup;
  gradeOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.enrollmentId = Number(this.route.snapshot.paramMap.get('id'));


    // Fetch enrollment details to get students
    this.apiService.getEnrollmentById(this.enrollmentId).pipe(take(1)).subscribe(enrollment => {
      this.students = enrollment.students;


      // Build form with one result input per student
      this.resultForm = this.fb.group({
        results: this.fb.array(
          this.students.map(s =>
            this.fb.group({
              studentId: [s.id],
              score: ['', Validators.required],
              grade: [''],
              id: [null] // To track existing results for updates
            })
          )
        )
      });

      this.apiService.getResultsByEnrollment(this.enrollmentId).pipe(take(1)).subscribe(existingResults => {
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
    });


  }

  get results(): FormArray {
    return this.resultForm.get('results') as FormArray;
  }

  onSubmit() {
    if (this.resultForm.valid) {
      let results = this.resultForm.value.results as any[];
      results.forEach(result => {
        result.enrollmentId = this.enrollmentId;
      });
    
      console.log('Submitting mass results:', results);
      this.apiService.bulkSaveResults(results).pipe(take(1)).subscribe(() => {
        alert('Results saved for all students 🎉');
      });
    }
  }
}
