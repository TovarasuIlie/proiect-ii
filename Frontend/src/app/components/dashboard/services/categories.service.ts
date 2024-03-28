import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CategoryInterface } from '../models/category-interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  addCategory(category: CategoryInterface) {
    return this.http.post(environment.apiUrl + "/api/Category/add-category", category);
  }

  getCategories() {
    return this.http.get<CategoryInterface[]>(environment.apiUrl + "/api/Category/get-categories");
  }

  getCategory(id: number) {
    return this.http.get<CategoryInterface>(environment.apiUrl + "/api/Category/get-category/" + id);
  }

  deleteCategory(id: number) {
    return this.http.delete(environment.apiUrl + "/api/Category/delete-category" + id);
  }
}
