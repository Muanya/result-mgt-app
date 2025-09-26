import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { FeatureListComponent } from './shared/components/feature-list/feature-list.component';

export const routes: Routes = [
  {
    path: 'student',
    canActivate: [authGuard],
    data: { roles: ['Student'] },
    loadChildren: () =>
      import('./features/student/student.routes').then(m => m.routes)
  },

  {
    path: 'teacher',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then(m => m.routes)
  },

  {
    path: 'public',
    loadChildren: () =>
      import('./features/public/public.routes').then(m => m.routes)
  },

  { path: 'list/:title', canActivate: [authGuard], component: FeatureListComponent },



  { path: '', redirectTo: 'public', pathMatch: 'full' },
];
