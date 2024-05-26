import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of} from 'rxjs';
import { ProductsService } from '../components/dashboard/services/products.service';
import { ProductsInterface } from '../components/dashboard/models/products.model';
import { CategoriesService } from '../components/dashboard/services/categories.service';
import { AdminService } from '../components/dashboard/services/admin.service';
 
@Injectable({
  providedIn: 'root'
})

export class MembersCountResolverService implements Resolve<Observable<ProductsInterface[]> > {
  constructor(private adminService: AdminService) {
  }
  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsInterface[]> {
    return this.adminService.getMembersCount().pipe(
      catchError((response) => {
        return of(response);
      })
    );
  }
}
