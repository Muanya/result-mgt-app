import { Component, ViewChild } from '@angular/core';
import { NavItem, Student } from '../../../shared/models/student.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { StudentService } from '../../../services/student/student.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    RouterModule, NavbarComponent],
})
export class StudentListComponent {
  displayedColumns = ['admissionNo', 'firstName', 'lastName', 'class', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  total = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  menu: NavItem[] = [
    // { label: 'Home', route: '/' },
 
    {
      label: 'Profile',
      children: [
        { label: 'My Profile', route: '/profile' },
        { label: 'Logout', action: () => this.logout() }
      ]
    }
  ];

  constructor(private authService: AuthService, private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.load();
  }

  load(page = 0, size = 20, search = '') {
    // this.studentService.getStudents({ page, size, search }).subscribe(resp => {
    //   this.dataSource.data = resp.data;
    //   this.total = resp.total;
    //   setTimeout(() => this.dataSource.paginator = this.paginator);
    // });
  }

  applyFilter(filterValue: string) {
    this.load(0, 20, filterValue.trim().toLowerCase());
  }

  deleteStudent(s: Student) {
    if (!confirm(`Delete ${s.firstName} ${s.lastName}?`)) return;
    this.studentService.delete(s.id!).subscribe(() => this.load());
  }

  logout() {
    this.authService.logout().pipe(take(1)).subscribe(response => {
      console.log('Logout successful:', response);
      this.router.navigate(['/public/']);

    });
  }

}
