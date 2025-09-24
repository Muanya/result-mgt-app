import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { EnrollmentDetail } from '../../../shared/models/shared.model';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { take } from 'rxjs';
import { SingleResultModalComponent } from '../../../shared/modal/single-result-modal/single-result-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-enrollment-detail',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './enrollment-detail.component.html',
  styleUrl: './enrollment-detail.component.scss'
})
export class EnrollmentDetailComponent implements OnInit {
  enrollment?: EnrollmentDetail;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.apiService.getEnrollmentById(id).pipe(take(1)).subscribe(data => {
        this.enrollment = data;
      });
    }
  }

  goToAddResult(studentId: number) {
    const dialogRef = this.dialog.open(SingleResultModalComponent, {
      width: '800px',
      data: {
        sId: studentId, eId: this.enrollment?.id,
        firstName: this.enrollment?.students.find(s => s.id === studentId)?.firstName,
        lastName: this.enrollment?.students.find(s => s.id === studentId)?.lastName
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed with:', result);
    });
  }

  goToMassResult() {
    if (this.enrollment) {
      this.router.navigate(['/teacher/result-entry', this.enrollment.id]);
    }
  }
}
