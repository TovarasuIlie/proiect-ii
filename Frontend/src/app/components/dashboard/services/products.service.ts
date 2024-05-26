import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getProductsPagination(currentPage: number, itemsPerPage: number) {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + "/api/Product/all-products-pagination?page=" + currentPage + "&pageSize=" + itemsPerPage);
  }

  getProductsCount() {
    return this.http.get<number>(environment.apiUrl + "/api/Product/all-products-count");
  }

  getProduct(id: number) {
    return this.http.get<ProductsInterface>(environment.apiUrl + "/api/Product/get-product-by-id/" + id);
  }

  getProductsByName(name: string) {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + "/api/Product/get-product-by-name/" + name);
  }

  getProductsByNamePagination(name: string, currentPage: number, pageSize: number) {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + "/api/Product/get-products-by-name-pagination/" + name + "?page=" + currentPage + "&pageSize=" + pageSize);
  }

  addNewProduct(product: ProductAddInterface) {
    const headers = new HttpHeaders().append("Content-Disposition", 'multipart/form-data')
    let productData = new FormData();
    productData.append("title", product.title);
    productData.append("description", product.description);
    productData.append("technicalDetailsJson", product.technicalDetailsJson);
    productData.append("folderName", product.title);
    productData.append("quantity", product.quantity.toString());
    productData.append("price", product.price.toString());
    productData.append("category.id", product.category?.id.toString() || "");
    productData.append("category.name", product.category?.name || "");
    productData.append("category.imageFilename", product.category?.imageFilename || "");
    productData.append("category.categoryNameSearch", product.category?.categoryNameSearch || "");
    if(product.image.length > 0) {
      product.image.forEach(element => {
        productData.append("image", element);
      });
    } else {
      productData.append("image", "null");
    }
    if(product.partForCar.length > 0) {
      product.partForCar.forEach(element => {
        productData.append("partsForCar", element.toString());
      })
    } else {
      productData.append("partForCars", "null");
    }
    return this.http.post(environment.apiUrl + "/api/Product/add-product", productData, {headers});
  }

  getProductsByCategoryName(categoryName: string) {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + '/api/Product/products-by-category-name/' + categoryName);
  }

  getProductsForCar(mark: string, model: string, engine: string) {
    return this.http.get<ProductsInterface[]>(environment.apiUrl + '/api/Product/get-product-by-car/' + mark + "/" + model + "/" + engine);
  }

  editProduct(product: ProductsInterface) {
    return this.http.put(environment.apiUrl + '/api/Product/update-product', product);
  }
  
  deleteProduct(ID: number) {
    return this.http.delete(environment.apiUrl + "/api/Product/delete-product/" + ID);
  }
}
