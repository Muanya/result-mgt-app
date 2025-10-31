import { Routes } from '@angular/router';
import { GradeDistributionComponent } from './grade-distribution/grade-distribution.component';
import { FeatureListComponent } from '../../shared/components/feature-list/feature-list.component';
import { CreateEnrollmentComponent } from './create-enrollment/create-enrollment.component';
import { EnrollmentDetailComponent } from './enrollment-detail/enrollment-detail.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentListComponent } from './student-list/student-list.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'courses', component: FeatureListComponent },
    { path: 'students', component: StudentListComponent },
    { path: 'course-detail/:id', component: CourseDetailComponent },
    { path: 'create', component: CreateEnrollmentComponent },
    { path: 'enrollment-detail/:id', component: EnrollmentDetailComponent },
    { path: 'grade-dist', component: GradeDistributionComponent },
    { path: 'result-entry/:id', component: ResultEntryComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

