import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';


export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Check if the user is logged in (could be an observable)
    const isLoggedIn = await firstValueFrom(authService.isLoggedIn());


    if (isLoggedIn === null) {
      router.navigate(['/public/splash']);
      return false;
    }

    if (!isLoggedIn) {
      router.navigate(['/public']);
      return false;
    }
    return true;
  } catch (error) {
    console.log('AuthGuard error:', error);

    router.navigate(['/public']);
    return false;
  }
};