import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StudentGrade } from '../../models/shared.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

export interface StudentSelectorData {
  students: StudentGrade[];
  selectedStudentIds: string[];
  isCustomSelection: boolean;
}

@Component({
  selector: 'app-student-selector-dialog',
  templateUrl: './student-selector-dialog.component.html',
  styleUrls: ['./student-selector-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,

  ],
})
export class StudentSelectorDialogComponent implements OnInit {
  searchTerm: string = '';
  filteredStudents: StudentGrade[] = [];
  selectedStudentIds: string[] = [];
  isCustomSelection: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<StudentSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentSelectorData
  ) { }

  ngOnInit() {
    this.selectedStudentIds = [...this.data.selectedStudentIds];
    this.isCustomSelection = this.data.isCustomSelection;
    this.filteredStudents = [...this.data.students];
    this.applySearch();
  }

  applySearch() {
    if (!this.searchTerm) {
      this.filteredStudents = [...this.data.students];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredStudents = this.data.students.filter(student =>
        student.studentName.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term)
      );
    }
  }

  isStudentSelected(studentId: string): boolean {
    return this.selectedStudentIds.includes(studentId);
  }

  toggleStudent(studentId: string) {
    const index = this.selectedStudentIds.indexOf(studentId);
    if (index > -1) {
      this.selectedStudentIds.splice(index, 1);
    } else {
      this.selectedStudentIds.push(studentId);
    }
  }

  selectAll() {
    this.selectedStudentIds = this.filteredStudents.map(student => student.studentId);
  }

  clearAll() {
    this.selectedStudentIds = [];
  }

  toggleSelectAll() {
    if (this.selectedStudentIds.length === this.filteredStudents.length) {
      this.clearAll();
    } else {
      this.selectAll();
    }
  }

  onSelectionModeChange() {
    if (!this.isCustomSelection) {
      // When switching to "All Students", select all
      this.selectedStudentIds = this.data.students.map(student => student.studentId);
    }
  }

  // Quick selection methods
  selectHighAchievers() {
    const highAchievers = this.filteredStudents.filter(student =>
      student.average >= 90
    );
    this.selectedStudentIds = highAchievers.map(student => student.studentId);
  }

  selectByGrade(grade: string) {
    console.log("Not Implemented");
    
    // const gradeStudents = this.filteredStudents.filter(student =>
    //   student.grade.startsWith(grade)
    // );
    // this.selectedStudentIds = gradeStudents.map(student => student.studentId);
  }


  useAllStudents() {
    this.isCustomSelection = false;
    this.selectedStudentIds = this.data.students.map(student => student.studentId);
  }

  get selectedCount(): number {
    return this.selectedStudentIds.length;
  }

  get allStudentsCount(): number {
    return this.data.students.length;
  }

  onSave() {
    this.dialogRef.close({
      selectedStudentIds: this.selectedStudentIds,
      isCustomSelection: this.isCustomSelection
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}