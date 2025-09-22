import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student',
    data: { roles: ['Student'] },
    loadChildren: () =>
      import('./features/student/student.routes').then(m => m.routes)
  },

  {
    path: 'public',
    loadChildren: () =>
      import('./features/public/public.routes').then(m => m.routes)
  },

  { path: '**', redirectTo: 'public' }
];
