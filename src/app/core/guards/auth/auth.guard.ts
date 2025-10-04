import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';


export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard checks on server
  if (!isPlatformBrowser(platformId)) {
    console.log(`AuthGuard: running on server (${platformId}), allowing navigation`);
    return true;
  }

  try {
    const isLoggedIn = await firstValueFrom(authService.isLoggedIn());    

    if (isLoggedIn) {
      return true;
    }

    console.warn('AuthGuard: user not logged in, redirecting');
    return router.parseUrl('/public');
  } catch (error) {
    console.error('AuthGuard error:', error);
    return router.parseUrl('/public');
  }
};