import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ApiService } from '../../../services/api/api.service';
import { UserDetail } from '../../models/shared.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';

export interface AddStudentsDialogData {
  enrollmentId: number;
  currentStudents: UserDetail[];
}

@Component({
  selector: 'app-add-students-dialog',
  templateUrl: './add-students-dialog.component.html',
  styleUrls: ['./add-students-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule
  ]
})
export class AddStudentsDialogComponent implements OnInit {
  allStudents: UserDetail[] = [];
  dataSource: MatTableDataSource<UserDetail> = new MatTableDataSource<UserDetail>([]);
  searchControl = new FormControl('');
  selectedStudents: UserDetail[] = [];
  isLoading = false;
  
  // Table properties
  displayedColumns: string[] = ['select', 'name', 'email', 'studentId'];
  selection = new Set<number>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<AddStudentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddStudentsDialogData,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadAllStudents();
    this.setupFilter();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadAllStudents(): void {
    this.isLoading = true;
    this.apiService.getAllStudents().pipe(take(1)).subscribe({
      next: (students) => {
        // Filter out students that are already enrolled
        const currentStudentIds = new Set(this.data.currentStudents.map(s => s.id));
        this.allStudents = students.filter(student => !currentStudentIds.has(student.id));
        this.dataSource.data = this.allStudents;
        this.isLoading = false;
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

  setupFilter(): void {
    this.searchControl.valueChanges.subscribe(value => {
      this.applyFilter(value || '');
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleStudentSelection(student: UserDetail): void {
    if (this.selection.has(student.id)) {
      this.selection.delete(student.id);
      this.selectedStudents = this.selectedStudents.filter(s => s.id !== student.id);
    } else {
      this.selection.add(student.id);
      this.selectedStudents.push(student);
    }
  }

  isStudentSelected(student: UserDetail): boolean {
    return this.selection.has(student.id);
  }

  selectAllStudents(): void {
    const filteredData = this.dataSource.filteredData;
    filteredData.forEach(student => {
      if (!this.selection.has(student.id)) {
        this.selection.add(student.id);
        this.selectedStudents.push(student);
      }
    });
  }

  clearSelection(): void {
    this.selection.clear();
    this.selectedStudents = [];
  }

  getSelectedCount(): number {
    return this.selection.size;
  }

  getDisplayName(student: UserDetail): string {
    return `${student.firstName} ${student.lastName}`;
  }

  onAddStudents(): void {
    if (this.selectedStudents.length === 0) {
      this.snackBar.open('Please select at least one student', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    const selectedStudentIds = this.selectedStudents.map(student => student.id);
    this.dialogRef.close(selectedStudentIds);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Select/Deselect all in current filtered view
  toggleSelectAll(): void {
    const filteredData = this.dataSource.filteredData;
    const allSelected = filteredData.every(student => this.selection.has(student.id));
    
    if (allSelected) {
      // Deselect all in current view
      filteredData.forEach(student => {
        this.selection.delete(student.id);
      });
      // Update selectedStudents array
      this.selectedStudents = this.selectedStudents.filter(
        student => !filteredData.some(s => s.id === student.id)
      );
    } else {
      // Select all in current view
      filteredData.forEach(student => {
        if (!this.selection.has(student.id)) {
          this.selection.add(student.id);
          this.selectedStudents.push(student);
        }
      });
    }
  }

  // Check if all filtered students are selected
  isAllFilteredSelected(): boolean {
    const filteredData = this.dataSource.filteredData;
    return filteredData.length > 0 && filteredData.every(student => this.selection.has(student.id));
  }

  // Check if some filtered students are selected
  isSomeFilteredSelected(): boolean {
    const filteredData = this.dataSource.filteredData;
    return filteredData.some(student => this.selection.has(student.id)) && !this.isAllFilteredSelected();
  }

  // Get the currently filtered students for display
  getFilteredStudents(): UserDetail[] {
    return this.dataSource.filteredData;
  }
}