import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { UserRole } from '../../../shared/models/shared.enum';

export const publicGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard checks on server
  if (!isPlatformBrowser(platformId)) {
    console.log(`PublicGuard: running on server (${platformId}), allowing navigation`);
    return true;
  }

  try {
    const isLoggedIn = await firstValueFrom(authService.isLoggedIn());

    if (!isLoggedIn) {
      return true;
    }

    let userRole = authService.getUserRole()

    if (!userRole) {
      await authService.getUserDetails();
      userRole = authService.getUserRole();
    }

    if (userRole === UserRole.MAGISTER) {
      router.navigate(['/teacher']);

      return false;
    } else {
      router.navigate(['/student']);
      return false;
    }

  } catch (error) {
    console.error('PublicGuard error:', error);
    return true
  }
};
