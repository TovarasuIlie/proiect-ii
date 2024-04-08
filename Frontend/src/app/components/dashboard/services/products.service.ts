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
    return this.http.get<ProductsInterface[]>(environment.apiUrl + "/api/Product/all-products");
  }

  getProduct(id: string) {
    return this.http.get<ProductsInterface>(environment.apiUrl + "/api/Product/get-product-by-id/" + id);
  }

  addNewProduct(product: ProductAddInterface) {
    return this.http.post(environment.apiUrl + "/api/Product/add-product", product);
  }

  getProductsByCategoryName(categoryName: string) {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + '/api/Product/products-by-category-name/' + categoryName);
  }

  editProduct(product: ProductsInterface) {
    return this.http.put(environment.apiUrl + '/api/Product/update-product', product)
  }
  
  deleteProduct(ID: number) {
    return this.http.delete(environment.apiUrl + "/api/Product/delete-product/" + ID);
  }
}
