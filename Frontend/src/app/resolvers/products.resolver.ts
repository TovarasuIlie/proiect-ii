import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../components/dashboard/services/products.service';
import { ProductsInterface } from '../components/dashboard/models/products.model';
 
@Injectable({
  providedIn: 'root'
})

export class ProductsResolverService implements Resolve<ProductsInterface[]> {
  constructor(private productService: ProductsService) {}
  resolve(): Observable<ProductsInterface[]> {
    return this.productService.getProducts().pipe();
  }
}
