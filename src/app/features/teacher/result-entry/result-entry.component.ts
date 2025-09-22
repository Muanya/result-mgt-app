import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../../services/student/student.service';
import { ResultService } from '../../../services/result/result.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-result-entry',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './result-entry.component.html',
  styleUrl: './result-entry.component.scss'
})
export class ResultEntryComponent {
 form!: FormGroup;
  subjects: any[] = [];
  students: any[] = [];
terms: any;

  constructor(private fb: FormBuilder,
              private resultService: ResultService,
              private studentService: StudentService,
             ) {}

  ngOnInit() {
    this.form = this.fb.group({
      studentId: [null, Validators.required],
      termId: [null, Validators.required],
      entries: this.fb.array([])
    });

    this.resultService.getAll().subscribe(s => this.subjects = s);
    this.studentService.getStudents({ size: 1000 }).subscribe(r => this.students = r.data);
  }

  get entries(): FormArray { return this.form.get('entries') as FormArray; }

  addEntry(subjectId?: number, score?: number) {
    this.entries.push(this.fb.group({
      subjectId: [subjectId ?? null, Validators.required],
      score: [score ?? null, [Validators.required, Validators.min(0), Validators.max(100)]]
    }));
  }

  removeEntry(i: number) { this.entries.removeAt(i); }

  scoreToGrade(score: number): string {
    if (score >= 75) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  }

  submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const payload = this.form.value;
    const results = payload.entries.map((e: any) => ({
      studentId: payload.studentId,
      termId: payload.termId,
      subjectId: e.subjectId,
      score: e.score,
      grade: this.scoreToGrade(e.score)
    }));
    this.resultService.bulkCreate(results).subscribe(() => {
      alert('Results saved');
      this.form.reset();
      this.entries.clear();
    });
  }
}
