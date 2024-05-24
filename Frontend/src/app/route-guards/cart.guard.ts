import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from '../components/shared/services/toast.service';
import { Observable, map } from 'rxjs';
import { UserInteface } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class CartGuard {
  constructor(private userService: UserService, private toasterService: ToastService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.user$.pipe(
      map((user: UserInteface | null) => {
        if(user) {
          const cartItems = localStorage.getItem(user.userName);
          if(cartItems && cartItems?.length > 0) {
            return true;
          } else {
            this.toasterService.show({title: "Acces interzis!", message: "Trebuie sa ai minim un produs in cos pentru a putea plasa o comanda!", classname: "text-danger"});
            this.router.navigateByUrl('/');
            return false;
          }
        } else {
          return false;
        }
      })
    );
  }
}
