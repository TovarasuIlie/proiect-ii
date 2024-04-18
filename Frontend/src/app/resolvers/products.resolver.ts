import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Params, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { ProductsService } from '../components/dashboard/services/products.service';
import { ProductsInterface } from '../components/dashboard/models/products.model';
 
@Injectable({
  providedIn: 'root'
})

export class ProductsResolverService implements Resolve<Observable<ProductsInterface[]> > {
  categoryName: string = '';
  constructor(private productService: ProductsService) {
  }
  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsInterface[]> {
    if(router.paramMap.get("partCategory")) {
      this.categoryName = router.paramMap.get("partCategory") || '';
    } else {
      this.categoryName = state.url.slice(1, 9);
    }
    return this.productService.getProductsByCategoryName(this.categoryName).pipe(
      catchError((response) => {
        return of(response);
      })
    );
  }
}
