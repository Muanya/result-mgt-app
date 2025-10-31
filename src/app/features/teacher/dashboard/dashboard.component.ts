import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  change: number;
  description: string;
}



@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,

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
      time: '2 hours ago',
      color: 'primary'
    },
    {
      icon: 'assignment_turned_in',
      title: 'Results Published',
      description: 'Mathematics Spring 2023 results are available',
      time: '5 hours ago',
      color: 'accent'
    },
    {
      icon: 'library_add',
      title: 'New Course Added',
      description: 'Introduction to Artificial Intelligence',
      time: 'Yesterday',
      color: 'warn'
    },
    {
      icon: 'event_available',
      title: 'Attendance Alert',
      description: 'Low attendance reported for Physics 101',
      time: '2 days ago',
      color: 'success'
    }
  ];

  quickActions = [
    { icon: 'person_add', label: 'Add Student', color: 'primary' },
    { icon: 'library_add', label: 'Create Course', color: 'accent' },
    { icon: 'assignment', label: 'Enter Results', color: 'warn' },
    { icon: 'notifications', label: 'Send Alert', color: 'success' }
  ];


   statCards: StatCard[] = [
    {
      title: 'Total Students',
      value: '1,248',
      icon: 'people',
      color: 'primary',
      change: 12.5,
      description: 'Since last month'
    },
    {
      title: 'Active Courses',
      value: 42,
      icon: 'book',
      color: 'accent',
      change: 3.2,
      description: '3 new this month'
    },
    {
      title: 'Results Published',
      value: '86%',
      icon: 'bar_chart',
      color: 'warn',
      change: -2.1,
      description: 'From last term'
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      icon: 'event_available',
      color: 'success',
      change: 1.8,
      description: 'This week average'
    }
  ];

  constructor() { }

  onQuickAction(action: string) {
    console.log('Quick action:', action);
    // Implement quick action logic here
  }



  getChangeIcon(change: number): string {
    return change >= 0 ? 'arrow_upward' : 'arrow_downward';
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'positive' : 'negative';
  }

}
