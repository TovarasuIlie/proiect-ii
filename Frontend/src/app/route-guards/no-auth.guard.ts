import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })

class NoAuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if(localStorage.getItem(environment.userKey)) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}

export const noAuthGuard: CanActivateFn = (route, state) => {
  return inject(NoAuthGuard).canActivate();
};
