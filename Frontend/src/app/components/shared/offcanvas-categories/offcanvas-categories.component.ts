import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../dashboard/services/categories.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShareDataService } from '../../../services/share-data.service';

@Component({
  selector: 'app-offcanvas-categories',
  templateUrl: './offcanvas-categories.component.html',
  styleUrl: './offcanvas-categories.component.css'
})
export class OffcanvasCategoriesComponent implements OnInit {

  categories: CategoryInterface[] = [];

  constructor(private categoryService: CategoriesService, private shareData: ShareDataService) {

  }

  ngOnInit(): void {
    this.initializeCategories();
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.categories = value;
        this.shareData.setData(value);
      }
    })
  }

}
