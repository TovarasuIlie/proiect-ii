import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from '../components/shared/services/toast.service';
import { Observable, map } from 'rxjs';
import { UserInteface } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthorizationGuard {
  constructor(private userService: UserService, private toasterService: ToastService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.user$.pipe(
      map((user: UserInteface | null) => {
        if(user) {
          return true;
        } else {
          this.toasterService.show({title: "Acces interzis!", message: "Pentru a intra pe acea pagina trebuie sa fi autentificat!", classname: "text-danger"});
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }
}
