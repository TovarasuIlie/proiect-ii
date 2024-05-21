import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoriesService } from '../../dashboard/services/categories.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';
import { CarService } from '../../../services/car.service';
import { EngineInterface, MarkInterface, ModelInterface } from '../../../models/car.model';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css'
})
export class IndexPageComponent {
  categoryList!: CategoryInterface[];
  marksList: MarkInterface[] = [];
  modelsList: ModelInterface[] = [];
  enginesList: EngineInterface[] = [];

  constructor(private titleService: Title, private categoryService: CategoriesService, private carService: CarService) {
    this.titleService.setTitle("La Vericu' SRL");
  }

  ngOnInit(): void {
    this.initializeCategories();
    this.initializeMarks();
  }

  initializeCategories() {
    this.categoryService.getCategories().subscribe({
      next: (value) => {
        this.categoryList = value;
      },
    })
  }

  initializeMarks() {
    this.carService.getMarks().subscribe({
      next: (value) => {
        this.marksList = value;
      }
    });
  }

  initializeModels(markID: number) {
    this.carService.getModels(markID).subscribe({
      next: (value) => {
        this.modelsList = value;
      }
    })
  }

  initializeEngines(modelID: number) {
    this.carService.getEngines(modelID).subscribe({
      next: (value) => {
        this.enginesList = value;
      }
    })
  }

  getMark($event: any) {
    this.initializeModels($event.target.value);
    this.enginesList = [];
  }

  getModel($event: any) {
    this.initializeEngines($event.target.value);
  }

  getImage(imageName: string) {
    return 'http://localhost:5020/SiteUploads/category-icons/' + imageName;
  }

  getLink(categoryName: string) {
    return categoryName.includes('anvelope') ? '/anvelope' : '/piese-de-schimb/' + categoryName
  }
}
