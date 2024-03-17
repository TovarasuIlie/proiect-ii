import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })

class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if(localStorage.getItem(environment.userKey)) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate();
}
