import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of} from 'rxjs';
import { ProductsService } from '../components/dashboard/services/products.service';
import { ProductsInterface } from '../components/dashboard/models/products.model';
 
@Injectable({
  providedIn: 'root'
})

export class ProductsForCarResolverService implements Resolve<Observable<ProductsInterface[]> > {
  constructor(private productService: ProductsService) {
  }
  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsInterface[]> {
    console.log(router.paramMap.get("engine"))
    return this.productService.getProductsForCar(router.paramMap.get("mark") || "", router.paramMap.get("model") || "", router.paramMap.get("engine") || "").pipe(
      catchError((response) => {
        return of(response);
      })
    );
  }
}
