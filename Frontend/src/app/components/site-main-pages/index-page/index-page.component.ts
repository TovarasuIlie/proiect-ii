import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoriesService } from '../../dashboard/services/categories.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css'
})
export class IndexPageComponent {
  categoryList!: CategoryInterface[];
  constructor(private titleService: Title, private categoryService: CategoriesService) {
    this.titleService.setTitle("La Vericu' SRL");
  }

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

  getImage(imageName: string) {
    return 'http://localhost:5020/SiteUploads/category-icons/' + imageName;
  }

  getLink(categoryName: string) {
    return categoryName.includes('anvelope') ? '/anvelope' : '/piese-de-schimb/' + categoryName
  }
}
