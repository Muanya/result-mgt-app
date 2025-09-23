import { Routes } from '@angular/router';
import { GradeDistributionComponent } from './grade-distribution/grade-distribution.component';
import { StudentListComponent } from './student-list/student-list.component';

export const routes: Routes = [
    {path: '',  component: StudentListComponent},
    { path: 'grade-dist', component: GradeDistributionComponent },

];

