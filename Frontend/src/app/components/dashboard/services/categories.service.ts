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
    return this.http.post(environment.apiUrl + "/api/Category", category);
  }

  getCategories() {
    return this.http.get<CategoryInterface[]>(environment.apiUrl + "/api/Category");
  }

  deleteCategory(id: string) {
    return this.http.delete(environment.apiUrl + "/api/Category/" + id);
  }
}
