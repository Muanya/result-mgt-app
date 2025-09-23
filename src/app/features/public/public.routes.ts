import { Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { SplashComponent } from './splash/splash.component';

export const routes: Routes = [
    { path: 'splash', component: SplashComponent },
    { path: 'auth', component: AuthenticateComponent },
    { path: '', redirectTo: 'auth', pathMatch: 'full' }

];

