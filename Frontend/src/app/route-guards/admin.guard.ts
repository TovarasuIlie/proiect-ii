import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserInteface } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { ToastService } from '../components/shared/services/toast.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard {

  constructor(private userService: UserService, private toastService: ToastService, private router: Router) {
    
  }
  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      map((user: UserInteface | null) => {
        if(user) {
          const decodedToken: any = jwtDecode(user.jwt);
          if(decodedToken.role.includes('Admin')) {
            return true;
          }
        }

        this.toastService.show({title: "Acces interzis!", message: "Nu sunteti autorizat ca sa intrati pe aceasta pagina!", classname: "text-danger"});
        this.router.navigateByUrl('/');
        return false;
      })
    );
  }
};
