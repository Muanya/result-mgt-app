import { Routes } from '@angular/router';

export const routes: Routes = [
      {
    path: 'student',
    data: { roles: ['Student'] },
    loadChildren: () =>
      import('./features/student/student-module').then(m => m.StudentModule)
  },

  { path: '**', redirectTo: 'auth/login' }
];
