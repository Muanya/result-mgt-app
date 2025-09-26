import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
  student: any = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    department: 'Computer Engineering',
    image: 'https://i.pravatar.cc/150?img=3'
  };

  results = [
    { course: 'Mathematics', score: 86, grade: 'A' },
    { course: 'Physics', score: 75, grade: 'B' },
    { course: 'Computer Science', score: 92, grade: 'A+' }
  ];


  constructor() { }

  ngOnInit(): void {
    
  }



}
