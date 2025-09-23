import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { roles: ['Student'] },
    loadChildren: () =>
      import('./features/student/student.routes').then(m => m.routes)
  },

  {
    path: 'public',
    loadChildren: () =>
      import('./features/public/public.routes').then(m => m.routes)
  },

  { path: '**', redirectTo: 'public/splash' }
];
