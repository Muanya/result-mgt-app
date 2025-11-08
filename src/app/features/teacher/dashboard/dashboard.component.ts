import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TimeAgoPipe } from '../../../core/pipes/time-ago';
import { Router } from '@angular/router';

interface Activity {
  icon: string;
  title: string;
  description: string;
  time: Date;
  color: string;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color?: string | null;
  change?: number | null;
}



@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    TimeAgoPipe,

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  recentActivities: Activity[] = [
    {
      icon: 'person_add',
      title: 'New Student Registration',
      description: 'Sarah Johnson enrolled in Computer Science',
      time: new Date('2025-11-01T10:10:00'),
      color: 'primary'
    },
    {
      icon: 'assignment_turned_in',
      title: 'Results Published',
      description: 'Mathematics Spring 2023 results are available',
      time: new Date('2025-11-01T10:10:00'),
      color: 'accent'
    },
    {
      icon: 'library_add',
      title: 'New Course Added',
      description: 'Introduction to Artificial Intelligence',
      time: new Date('2025-11-01T10:10:00'),
      color: 'warn'
    },
    {
      icon: 'event_available',
      title: 'Attendance Alert',
      description: 'Low attendance reported for Physics 101',
      time: new Date('2025-10-03T10:10:00'),
      color: 'success'
    }
  ];

  quickActions = [
    { icon: 'person_add', label: 'Add Student', color: 'primary' },
    { icon: 'library_add', label: 'Create Course', color: 'accent' },
    { icon: 'assignment', label: 'Enter Results', color: 'warn' },
    // { icon: 'notifications', label: 'Send Alert', color: 'success' }
  ];


  statCards: StatCard[] = [
    {
      title: 'Total Students',
      value: '1,248',
      icon: 'people',
      color: 'primary',
    },
    {
      title: 'Active Courses',
      value: 42,
      icon: 'book',
      color: 'accent',
    },
    {
      title: 'Total Enrollments',
      value: '59',
      icon: 'co_present',
      color: 'warn',
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      icon: 'event_available',
      color: 'success',
      change: 1.8,
    }
  ];

  constructor(private router: Router) { }

  onQuickAction(action: string) {
    console.log('Quick action:', action);
    if (action === 'Add Student') {
      this.router.navigate(['/teacher/students/add']);
    }else if (action === 'Create Course') {
      this.router.navigate(['/teacher/courses/create']);
    }else if (action === 'Enter Results') {
      this.router.navigate(['/teacher/results/entry']);
    }
  }



  getChangeIcon(change: number): string {
    return change >= 0 ? 'arrow_upward' : 'arrow_downward';
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'positive' : 'negative';
  }

}
