import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../services/api/api.service';
import { take } from 'rxjs';
import { SingleResultModal } from '../../models/shared.model';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-single-result-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './single-result-modal.component.html',
  styleUrl: './single-result-modal.component.scss'
})
export class SingleResultModalComponent implements OnInit {
  resultForm!: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<SingleResultModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SingleResultModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }


  gradeOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];


  ngOnInit(): void {


    this.resultForm = this.fb.group({
      studentId: [this.data.sId],
      score: ['', Validators.required],
      grade: [''],
      id: [null] // To track existing results for updates
    });


    this.apiService.getResultsByStudent(this.data.sId).pipe(take(1)).subscribe(er => {
      if (er && er.length) {
        console.log('Existing result', er);
        if (this.resultForm) {
          this.resultForm.patchValue({
            score: er[0].score,
            grade: er[0].grade,
            id: er[0].id
          });
        }

      }
    });
  };

  close() {
    this.dialogRef.close('Modal Closed');
  }

  onSubmit() {
    if (this.resultForm.valid) {
      let results = this.resultForm.value;
      results.enrollmentId = this.data.eId;
      console.log('Submitting mass results:', results);
        this.apiService.saveResult(results).pipe(take(1)).subscribe(() => {
          alert('Results saved 🎉');
          this.close();
        });
    }
  }
}




