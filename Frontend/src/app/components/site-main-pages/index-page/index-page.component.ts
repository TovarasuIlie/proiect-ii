import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoriesService } from '../../dashboard/services/categories.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';
import { CarService } from '../../../services/car.service';
import { EngineInterface, MarkInterface, ModelInterface } from '../../../models/car.model';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

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
  selectedMark!: string;
  selectedModel!: string;
  selectedEngine!: string;
  loading: boolean = true;

  constructor(private titleService: Title, private categoryService: CategoriesService, private carService: CarService, private router: Router) {
    this.titleService.setTitle("La Vericu' SRL");
  }

  ngOnInit(): void {
    this.initializeCategories();
    this.initializeMarks();
  }

  initializeCategories() {
    this.categoryService.getCategoriesPagination(1, 12).subscribe({
      next: (value) => {
        this.loading = false;
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
    this.selectedMark = this.marksList.filter(m => m.id == markID)[0].name;
    this.selectedModel = "";
    this.selectedEngine = "";
  }

  initializeEngines(modelID: number) {
    this.carService.getEngines(modelID).subscribe({
      next: (value) => {
        this.enginesList = value;
      }
    });
    this.selectedModel = this.modelsList.filter(m => m.id == modelID)[0].name;
    this.selectedEngine = "";
  }

  getMark($event: any) {
    this.initializeModels($event.target.value);
    this.enginesList = [];
  }

  getModel($event: any) {
    this.initializeEngines($event.target.value);
  }

  getEngine($event: any) {
    this.selectedEngine = this.enginesList.filter(e => e.id == $event.target.value)[0].name;
  }

  getImage(imageName: string) {
    return environment.apiUrl + '/SiteUploads/category-icons/' + imageName;
  }

  getLink(categoryName: string) {
    return categoryName.includes('anvelope') ? '/anvelope' : '/piese-de-schimb/' + categoryName
  }

  searchButton() {
    this.router.navigateByUrl("/piese-de-schimb/" + this.selectedMark + "/" + this.selectedModel + "/" + this.selectedEngine);
  }
}
