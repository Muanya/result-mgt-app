import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isLoggedIn().pipe(
      map(isLoggedIn => isLoggedIn ? true : this.router.createUrlTree(['/public']))
    );
  }

}