import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { take } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}


@Component({
  selector: 'app-teacher-layout',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule

  ],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.scss'
})
export class TeacherLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSidebarCollapsed = false;
  currentYear = new Date().getFullYear();
  isMobile = false;

   navigationItems: NavigationItem[] = [
    { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: 'courses', label: 'Courses', icon: 'book' },
    { path: 'results', label: 'Results', icon: 'bar_chart' },
    { path: 'enrollments', label: 'Enrollments', icon: 'school' },
    { path: 'messages', label: 'Messages', icon: 'message', badge: 5 }
  ];

  // User management group items
  userManagementItems: NavigationItem[] = [
    { path: 'students', label: 'Students', icon: 'people' },
    { path: 'magisters', label: 'Magisters', icon: 'people' }
  ];



  constructor(@Inject(PLATFORM_ID) private platformId: Object,
   private authService: AuthService,
      private router: Router,
) {
    this.checkScreenSize();
  }



  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }


  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      this.isSidebarCollapsed = this.isMobile;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.sidenav.toggle();
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }


  logout() {
    this.authService.logout().pipe(take(1)).subscribe(response => {
      console.log('Logout successful:', response);
      this.router.navigate(['/public/']);

    });
  }


}
