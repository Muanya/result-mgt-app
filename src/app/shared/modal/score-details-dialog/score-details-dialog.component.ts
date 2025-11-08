import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StudentGrade, CourseDetail } from '../../models/shared.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CUM_LAUDE, MAGNA_CUM_LAUDE, SUMMA_CUM_LAUDE } from '../../models/shared.constant';
import { ResultService } from '../../../services/result/result.service';

export interface ScoreDetailsData {
  student: StudentGrade;
  subjectId: string;
  subject: CourseDetail;
  grade: { score: number; grade: string; };
}

@Component({
  selector: 'app-score-details-dialog',
  templateUrl: './score-details-dialog.component.html',
  styleUrls: ['./score-details-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
})
export class ScoreDetailsDialogComponent implements OnInit {

  constructor(
    private gradeService: ResultService,
    private dialogRef: MatDialogRef<ScoreDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScoreDetailsData
  ) { }

  ngOnInit() { }

  getSubjectTypeClass(): string {
    return `subject-core`;
  }

  getScoreColorClass(): string {
    if (this.data.grade.score >= SUMMA_CUM_LAUDE) return 'grade-excellent';
    if (this.data.grade.score >= MAGNA_CUM_LAUDE) return 'grade-good';
    if (this.data.grade.score >= CUM_LAUDE) return 'grade-average';
    return 'grade-fail';
  }

  calculateGrade(score: number): string {
    return this.gradeService.getGrade(score);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  viewFullReport(): void {
    // Navigate to full student report page
    this.dialogRef.close('view-report');
  }
}