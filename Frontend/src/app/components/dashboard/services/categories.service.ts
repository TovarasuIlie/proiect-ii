import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CategoryInterface } from '../models/category-interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  addCategory(category: CategoryInterface) {
    let categoryForm = new FormData();
    categoryForm.append("name", category.name);
    categoryForm.append("image", category.image || "");
    categoryForm.append("imageFilename", category.name || "");
    categoryForm.append("categoryNameSearch", category.name);
    const headers = new HttpHeaders().append("Content-Disposition", 'multipart/form-data')
    return this.http.post(environment.apiUrl + "/api/Category/add-category", categoryForm, { headers });
  }

  getCategories() {
    return this.http.get<CategoryInterface[]>(environment.apiUrl + "/api/Category/get-categories");
  }

  getCategoriesPagination(currentPage: number, pageSize: number) {
    return this.http.get<CategoryInterface[]>(environment.apiUrl + "/api/Category/get-categories-pagination?page=" + currentPage + "&pageSize=" + pageSize);
  }
    
  getCategoryCount() {
    return this.http.get<number>(environment.apiUrl + "/api/Category/get-categories-count");
  }

  getCategory(id: number) {
    return this.http.get<CategoryInterface>(environment.apiUrl + "/api/Category/get-category/" + id);
  }

  deleteCategory(id: number) {
    return this.http.delete(environment.apiUrl + "/api/Category/delete-category/" + id);
  }

  updateCategory(category: CategoryInterface) {
    let categoryForm = new FormData();
    categoryForm.append("id", (category.id).toString());
    categoryForm.append("name", category.name);
    categoryForm.append("image", category.image || "");
    categoryForm.append("imageFilename", category.name || "");
    categoryForm.append("categoryNameSearch", category.name);
    const headers = new HttpHeaders().append("Content-Disposition", 'multipart/form-data')
    return this.http.put(environment.apiUrl + "/api/Category/update-category/", categoryForm);
  }
}
