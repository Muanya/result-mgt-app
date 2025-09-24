import { Component, ViewChild } from '@angular/core';
import { EntityListData, NavItem, Student } from '../../models/shared.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { StudentService } from '../../../services/student/student.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth/auth.service';
import { map, take } from 'rxjs';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    RouterModule, NavbarComponent, EntityListComponent],
})
export class FeatureListComponent {
  displayedColumns = ['admissionNo', 'firstName', 'lastName', 'class', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  total = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  title = "";

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

  entityData: EntityListData[] = [];


  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadTitle(this.route.snapshot.paramMap.get('title'));

    this.load();
  }
  loadTitle(arg0: string | null) {
    console.log("arg0 ", arg0);
    
    if (arg0 == null) {
      this.title = "Courses";
      return;
    }
    this.title = arg0.charAt(0).toUpperCase() + arg0.slice(1) + 's';

    console.log("title ", this.title);
    
  }

  load(page = 0, size = 20, search = '') {
    // this.studentService.getStudents({ page, size, search }).subscribe(resp => {
    //   this.dataSource.data = resp.data;
    //   this.total = resp.total;
    //   setTimeout(() => this.dataSource.paginator = this.paginator);
    // });

    if (this.title.toLowerCase() == 'magisters') {
      this.apiService.getAllMagisters().pipe(take(1), map(res => {
        return res.map((magister: { firstName: any; lastName: any; email: any; }) => ({ title: `${magister.firstName} ${magister.lastName}`, subtitle: magister.email, type: 'Student' }));
      })).subscribe(data => {
        this.entityData = data;
      });
    } else if (this.title.toLowerCase() == 'courses') {
      this.apiService.getAllCourses().pipe(take(1), map(res => {
        return res.map((data: { title: any; code: any; creditUnit: any; }) => ({ title: `${data.title}`, subtitle: data.code, type: 'Course' }));
      })).subscribe(data => {
        this.entityData = data;
      });
    } else {
      console.log("loading students");
      
      this.apiService.getAllStudents().pipe(take(1), map(res => {
        return res.map((data: { firstName: any; lastName: any; email: any; }) => ({ title: `${data.firstName} ${data.lastName}`, subtitle: data.email, type: 'Student' }));
      })).subscribe(data => {
        this.entityData = data;
      });
    }

  }

  applyFilter(filterValue: string) {
    this.load(0, 20, filterValue.trim().toLowerCase());
  }



  logout() {
    this.authService.logout().pipe(take(1)).subscribe(response => {
      console.log('Logout successful:', response);
      this.router.navigate(['/public/']);

    });
  }

}
