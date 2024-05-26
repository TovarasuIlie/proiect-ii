import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of} from 'rxjs';
import { ProductsService } from '../components/dashboard/services/products.service';
import { ProductsInterface } from '../components/dashboard/models/products.model';
import { CategoriesService } from '../components/dashboard/services/categories.service';
 
@Injectable({
  providedIn: 'root'
})

export class CategoryCountResolverService implements Resolve<Observable<ProductsInterface[]> > {
  constructor(private categoryService: CategoriesService) {
  }
  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsInterface[]> {
    return this.categoryService.getCategoryCount().pipe(
      catchError((response) => {
        return of(response);
      })
    );
  }
}
