import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard';
import { FeatureListComponent } from './shared/components/feature-list/feature-list.component';
import { roleGuard } from './core/guards/role/role-guard';
import { publicGuard } from './core/guards/public/public-guard';
import { TeacherLayoutComponent } from './features/teacher/teacher-layout/teacher-layout.component';

export const routes: Routes = [
  {
    path: 'student',
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    data: { roles: ['STUDENT'] },
    loadChildren: () =>
      import('./features/student/student.routes').then(m => m.routes)
  },

  {
    path: 'teacher',
    component: TeacherLayoutComponent, // wrap with your sidebar + topbar layout
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MAGISTER'] },
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then(m => m.routes)
  },

  {
    path: 'public',
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./features/public/public.routes').then(m => m.routes)
  },

  { path: 'list/:title', canActivate: [authGuard], component: FeatureListComponent },



  { path: '', redirectTo: 'public', pathMatch: 'full' },
];
