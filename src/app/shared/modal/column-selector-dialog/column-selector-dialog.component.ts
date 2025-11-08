

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CourseDetail } from '../../models/shared.model';
import { MatButtonModule } from '@angular/material/button';

export interface ColumnSelectorData {
  courses: CourseDetail[];
  selectedColumns: number[];
  availableColumns: number[];
}

@Component({
  selector: 'app-column-selector-dialog',
  templateUrl: './column-selector-dialog.component.html',
  styleUrls: ['./column-selector-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule
  ],
})
export class ColumnSelectorDialogComponent implements OnInit {
  selectedColumns: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<ColumnSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColumnSelectorData
  ) { }

  ngOnInit() {
    this.selectedColumns = [...this.data.selectedColumns];
  }

  isSelected(subjectId: number): boolean {
    return this.selectedColumns.includes(subjectId);
  }

  toggleSubject(subjectId: number) {
    const index = this.selectedColumns.indexOf(subjectId);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(subjectId);
    }
  }

  selectAll() {
    this.selectedColumns = [...this.data.availableColumns];
  }

  clearAll() {
    this.selectedColumns = [];
  }

  get selectedCount(): number {
    return this.selectedColumns.length;
  }

  onSave() {
    this.dialogRef.close(this.selectedColumns);
  }

  onCancel() {
    this.dialogRef.close();
  }
}