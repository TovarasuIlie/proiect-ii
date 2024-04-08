import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductAddInterface, ProductsInterface } from '../models/products.model';
import { environment } from '../../../../environments/environment.development';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + "/api/Product");
  }

  getProduct(id: string) {
    return this.http.get<ProductsInterface>(environment.apiUrl + "/api/Product/" + id);
  }

  addNewProduct(product: ProductAddInterface) {
    return this.http.post(environment.apiUrl + "/api/Product", product);
  }
  
  deleteProduct(ID: number) {
    return this.http.delete(environment.apiUrl + "/api/Product/" + ID);
  }
}
