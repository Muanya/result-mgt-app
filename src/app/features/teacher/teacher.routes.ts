import { Routes } from '@angular/router';
import { GradeDistributionComponent } from './grade-distribution/grade-distribution.component';
import { FeatureListComponent } from '../../shared/components/feature-list/feature-list.component';
import { CreateEnrollmentComponent } from './create-enrollment/create-enrollment.component';
import { EnrollmentDetailComponent } from './enrollment-detail/enrollment-detail.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentAddComponent } from './student-add/student-add.component';
import { StudentDetailComponent } from '../student/student-detail/student-detail.component';
import { ResultDetailComponent } from './result-detail/result-detail.component';
import { ViewAllResultsComponent } from './view-all-results/view-all-results.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'students', component: StudentListComponent },
    { path: 'students/add', component: StudentAddComponent },
    { path: 'students/detail', component: StudentDetailComponent },
    { path: 'results', component: ViewAllResultsComponent },
    { path: 'results/entry', component: ResultDetailComponent },

    { path: 'magisters', component: FeatureListComponent, data: { title: 'magister' } },
    { path: 'enrollments', component: FeatureListComponent, data: { title: 'enrollment' } },

    { path: 'courses', component: FeatureListComponent, data: { title: 'course' } },
    { path: 'courses/detail/:id', component: CourseDetailComponent },

    { path: 'enrollments/create', component: CreateEnrollmentComponent },
    { path: 'enrollments/detail/:id', component: EnrollmentDetailComponent },

    { path: 'grade-dist', component: GradeDistributionComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

