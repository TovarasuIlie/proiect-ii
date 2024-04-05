import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../dashboard/services/categories.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';

@Component({
  selector: 'app-offcanvas-categories',
  templateUrl: './offcanvas-categories.component.html',
  styleUrl: './offcanvas-categories.component.css'
})
export class OffcanvasCategoriesComponent implements OnInit {

  categories: CategoryInterface[] = [];

  @Output() categoriesEmitter = new EventEmitter<CategoryInterface[]>();
  constructor(private categoryService: CategoriesService) {

  }

  ngOnInit(): void {
    this.initializeCategories();
  }

  loadCategories() {
    this.categoriesEmitter.emit(this.categories);
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.categories = value;
        this.loadCategories();
      }
    })
  }

}
