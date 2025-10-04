import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UserRole } from '../../../shared/models/shared.enum';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Skip guard checks on server
  if (!isPlatformBrowser(platformId)) {
    console.log(`RoleGuard: running on server (${platformId}), allowing navigation`);
    return true;
  }

  let userRole = auth.getUserRole();
  const allowedRoles = route.data['roles'] as Array<UserRole>;



  if (!userRole) {
    await auth.getUserDetails();
    userRole = auth.getUserRole();
  }

  if (allowedRoles.includes(userRole!)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
