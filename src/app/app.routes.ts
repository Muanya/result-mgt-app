import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { FeatureListComponent } from './shared/components/feature-list/feature-list.component';

export const routes: Routes = [
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { roles: ['Student'] },
    loadChildren: () =>
      import('./features/student/student.routes').then(m => m.routes)
  },

  {
    path: 'teacher',
    canActivate: [],
    data: { roles: ['Student'] },
    loadChildren: () =>
      import('./features/teacher/teacher.routes').then(m => m.routes)
  },

  {
    path: 'public',
    loadChildren: () =>
      import('./features/public/public.routes').then(m => m.routes)
  },

  { path: 'list/:title', component: FeatureListComponent },



  { path: '**', redirectTo: 'public/splash' }
];
