import { Component, ViewChild } from '@angular/core';
import { Student } from '../../../shared/models/student.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { StudentService } from '../../../services/student/student.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    RouterModule
  ],
})
export class StudentListComponent {
  displayedColumns = ['admissionNo', 'firstName', 'lastName', 'class', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  total = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.load();
  }

  load(page = 0, size = 20, search = '') {
    this.studentService.getStudents({ page, size, search }).subscribe(resp => {
      this.dataSource.data = resp.data;
      this.total = resp.total;
      setTimeout(() => this.dataSource.paginator = this.paginator);
    });
  }

  applyFilter(filterValue: string) {
    this.load(0, 20, filterValue.trim().toLowerCase());
  }

  deleteStudent(s: Student) {
    if (!confirm(`Delete ${s.firstName} ${s.lastName}?`)) return;
    this.studentService.delete(s.id!).subscribe(() => this.load());
  }

}
