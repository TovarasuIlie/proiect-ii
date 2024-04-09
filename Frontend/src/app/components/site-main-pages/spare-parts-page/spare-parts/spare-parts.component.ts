import { Component, OnInit } from '@angular/core';
import { CategoryInterface } from '../../../dashboard/models/category-interface';
import { CategoriesService } from '../../../dashboard/services/categories.service';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrl: './spare-parts.component.css'
})
export class SparePartsComponent implements OnInit {
  categoryList: CategoryInterface[] = [];

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.initializeCategories();
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.categoryList = value;
      },
    })
  }

  getLogo(logoName: string) {
    return '/assets/category-icons/' + logoName;
  }

}
