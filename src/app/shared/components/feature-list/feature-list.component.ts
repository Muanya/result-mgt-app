import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { EntityListData, NavItem, Student } from '../../models/shared.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth/auth.service';
import { map, Observable, of, take } from 'rxjs';
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
    RouterModule, EntityListComponent],
})
export class FeatureListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['admissionNo', 'firstName', 'lastName', 'class', 'actions'];
  dataSource = new MatTableDataSource<Student>([]);
  total = 0;
  isBrowser = false;

  title = "";

  entityData$!: Observable<EntityListData[]>;
  // entityData: EntityListData[] = [];


  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }

  ngOnInit() {
    this.loadTitle(this.route.snapshot.paramMap.get('title'));

    if (this.isBrowser) {
      this.entityData$ = this.load();
    } else {
      this.entityData$ = of([]); // Empty observable for SSR
    }
  }


  loadTitle(arg0: string | null) {
    if (arg0 == null) {
      this.title = "Courses";
      return;
    }
    this.title = arg0.charAt(0).toUpperCase() + arg0.slice(1) + 's';

    console.log("title ", this.title);

  }

   load(page = 0, size = 20, search = ''): Observable<EntityListData[]> {
    if (this.title.toLowerCase() == 'magisters') {
      return this.apiService.getAllMagisters().pipe(
        take(1),
        map(res => res.map((magister: { firstName: any; lastName: any; email: any; }) =>
          ({ title: `${magister.firstName} ${magister.lastName}`, subtitle: magister.email, type: 'Student' })
        ))
      );
    } else if (this.title.toLowerCase() == 'courses') {
      return this.apiService.getAllCourses().pipe(
        take(1),
        map(res => res.map((data: { title: any; code: any; creditUnit: any; }) =>
          ({ title: `${data.title}`, subtitle: data.code, type: 'Course' })
        ))
      );
    } else {
      return this.apiService.getAllStudents().pipe(
        take(1),
        map(res => res.map((data: { firstName: any; lastName: any; email: any; }) =>
          ({ title: `${data.firstName} ${data.lastName}`, subtitle: data.email, type: 'Student' })
        ))
      );
    }
  }

 applyFilter(filterValue: string) {
    if (this.isBrowser) {
      this.entityData$ = this.load(0, 20, filterValue.trim().toLowerCase());
    }
  }


  logout() {
    this.authService.logout().pipe(take(1)).subscribe(response => {
      console.log('Logout successful:', response);
      this.router.navigate(['/public/']);

    });
  }

}
