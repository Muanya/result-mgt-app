import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { EnrollmentDetail } from '../../../shared/models/shared.model';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { take } from 'rxjs';
import { SingleResultModalComponent } from '../../../shared/modal/single-result-modal/single-result-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../shared/modal/confirmation-dialog/confirmation-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { AddStudentsDialogComponent } from '../../../shared/modal/add-students-dialog/add-students-dialog.component';

@Component({
  selector: 'app-enrollment-detail',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    
  ],
  templateUrl: './enrollment-detail.component.html',
  styleUrl: './enrollment-detail.component.scss'
})
export class EnrollmentDetailComponent implements OnInit {
  enrollment?: EnrollmentDetail;
  editedEnrollment?: EnrollmentDetail;
  isEditMode = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEnrollment();
  }

  loadEnrollment(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isLoading = true;
      this.apiService.getEnrollmentById(id).pipe(take(1)).subscribe({
        next: (data) => {
          this.enrollment = data;
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('Error loading enrollment:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load enrollment details', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.enrollment) {
      // Create a deep copy for editing
      this.editedEnrollment = JSON.parse(JSON.stringify(this.enrollment));
    } else {
      this.editedEnrollment = undefined;
    }
  }

  saveChanges(): void {
    if (!this.editedEnrollment) return;

    this.isLoading = true;
    this.apiService.updateEnrollment(this.editedEnrollment.id, this.editedEnrollment)
      .pipe(take(1))
      .subscribe({
        next: (updatedEnrollment) => {
          this.enrollment = updatedEnrollment;
          this.isEditMode = false;
          this.isLoading = false;
          this.snackBar.open('Enrollment updated successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error updating enrollment:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to update enrollment', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  goToAddResult(studentId: number): void {
    const dialogRef = this.dialog.open(SingleResultModalComponent, {
      width: '800px',
      data: {
        sId: studentId, 
        eId: this.enrollment?.id,
        firstName: this.enrollment?.students.find(s => s.id === studentId)?.firstName,
        lastName: this.enrollment?.students.find(s => s.id === studentId)?.lastName
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Result added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  goToMassResult(): void {
    if (this.enrollment) {
      this.router.navigate(['/teacher/result-entry', this.enrollment.id]);
    }
  }

  openAddStudentsDialog(): void {
    const dialogRef = this.dialog.open(AddStudentsDialogComponent, {
      width: '900px',
      height: '600px',
      data: {
        enrollmentId: this.enrollment?.id,
        currentStudents: this.enrollment?.students || []
      }
    });

    dialogRef.afterClosed().subscribe(selectedStudents => {
      if (selectedStudents && selectedStudents.length > 0) {
        this.addStudentsToEnrollment(selectedStudents);
      }
    });
  }

  addStudentsToEnrollment(studentIds: number[]): void {
    if (!this.enrollment) return;

    this.isLoading = true;
    this.apiService.addStudentsToEnrollment(this.enrollment.id, studentIds)
      .pipe(take(1))
      .subscribe({
        next: (updatedEnrollment) => {
          this.enrollment = updatedEnrollment;
          this.isLoading = false;
          this.snackBar.open(`Added ${studentIds.length} student(s) to enrollment`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error adding students:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to add students', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  removeStudent(studentId: number): void {
    if (!this.enrollment || !this.editedEnrollment) return;

    const student = this.enrollment.students.find(s => s.id === studentId);
    if (!student) return;

    // Show confirmation dialog
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Remove Student',
        message: `Are you sure you want to remove ${student.firstName} ${student.lastName} from this enrollment?`
      }
    });

    confirmDialog.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Remove from edited enrollment (local state)
        this.editedEnrollment!.students = this.editedEnrollment!.students.filter(s => s.id !== studentId);
        
        // Optionally, you can also call API to remove from backend immediately
        // this.apiService.removeStudentFromEnrollment(this.enrollment.id, studentId).subscribe(...);
      }
    });
  }

  removeLecturer(lecturerId: number): void {
    if (!this.editedEnrollment) return;

    // Remove from edited enrollment (local state)
    this.editedEnrollment.magisters = this.editedEnrollment.magisters.filter(l => l.id !== lecturerId);
  }

  manageLecturers(): void {
    // Implement lecturer management dialog
    // Similar to add students dialog
  }

  openDeleteDialog(): void {
    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Enrollment',
        message: 'Are you sure you want to delete this enrollment? This action cannot be undone.',
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    confirmDialog.afterClosed().subscribe(confirmed => {
      if (confirmed && this.enrollment) {
        this.deleteEnrollment();
      }
    });
  }

  deleteEnrollment(): void {
    if (!this.enrollment) return;

    this.isLoading = true;
    this.apiService.deleteEnrollment(this.enrollment.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Enrollment deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/teacher/enrollments']);
        },
        error: (error) => {
          console.error('Error deleting enrollment:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to delete enrollment', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getStatusColor(): string {
    if (!this.enrollment?.status) return 'primary';
    
    switch (this.enrollment.status.toLowerCase()) {
      case 'active': return 'primary';
      case 'completed': return 'accent';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }


}

