import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of} from 'rxjs';
import { ProductsInterface } from '../components/dashboard/models/products.model';
import { OrderService } from '../services/order.service';
 
@Injectable({
  providedIn: 'root'
})

export class OrderResolverService implements Resolve<Observable<ProductsInterface[]> > {
  constructor(private orderService: OrderService) {
  }
  resolve(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductsInterface[]> {
    console.log(router.paramMap.get("id"));
    return this.orderService.getOrder(parseInt(router.paramMap.get("id") || "0")).pipe(
      catchError((response) => {
        return of(response);
      })
    );
  }
}
