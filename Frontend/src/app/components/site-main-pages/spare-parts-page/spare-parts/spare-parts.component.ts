import { Component, OnInit } from '@angular/core';
import { CategoryInterface } from '../../../dashboard/models/category-interface';
import { CategoriesService } from '../../../dashboard/services/categories.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrl: './spare-parts.component.css'
})
export class SparePartsComponent implements OnInit {
  categoryList: CategoryInterface[] = [];
  loading: boolean = true;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.initializeCategories();
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.loading = false;
        this.categoryList = value;
      },
    })
  }

  getImage(imageName: string) {
    return environment.apiUrl + '/SiteUploads/category-icons/' + imageName;
  }

  getLink(categoryName: string) {
    return categoryName.includes('anvelope') ? '/anvelope' : '/piese-de-schimb/' + categoryName
  }
}
