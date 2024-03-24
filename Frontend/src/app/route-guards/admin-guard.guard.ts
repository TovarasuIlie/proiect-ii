import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })

class AdminGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if(false) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(AdminGuard).canActivate();
};
