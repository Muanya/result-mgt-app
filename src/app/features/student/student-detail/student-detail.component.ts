import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NavItem } from '../../../shared/models/shared.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    NavbarComponent,
  ],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements OnInit {
  student$!: Observable<any>;
  results$!: Observable<any[]>;

  results = [
    { course: 'Mathematics', score: 86, grade: 'A' },
    { course: 'Physics', score: 75, grade: 'B' },
    { course: 'Computer Science', score: 92, grade: 'A+' }
  ];


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


  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    this.student$ = this.authService.userDetails;


    this.student$.subscribe(student => {
      console.log("Student stream emitted:", student);
    });

    this.results$ = this.student$.pipe(
      filter((student): student is { id: number } => !!student),
      switchMap(student => {

        console.log('Fetching results for student ID:', student);

        return this.apiService.getResultsByStudent(student.id)
      }),

      tap(results => {
        console.log('Fetched results:', results);
      })
    );

    this.results$.subscribe();

  }

  logout() {
    this.authService.logout().pipe(take(1)).subscribe(response => {
      console.log('Logout successful:', response);
      this.router.navigate(['/public/']);
    });
  }

}
