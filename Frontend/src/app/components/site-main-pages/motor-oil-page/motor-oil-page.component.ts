import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { EngineInterface, MarkInterface, ModelInterface } from '../../../models/car.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motor-oil-page',
  templateUrl: './motor-oil-page.component.html',
  styleUrl: './motor-oil-page.component.css'
})
export class MotorOilPageComponent implements OnInit {
  marksList: MarkInterface[] = [];
  modelsList: ModelInterface[] = [];
  enginesList: EngineInterface[] = [];
  selectedMark!: string;
  selectedModel!: string;
  selectedEngine!: string;
  
  constructor(private carService: CarService, private router: Router) {}

  ngOnInit(): void {
    this.initializeMarks();
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
    setTimeout(() => {
      this.selectedEngine = this.enginesList.filter(e => e.id == $event.target.value)[0].name;
    }, 50)
  }

  searchButton() {
    this.router.navigateByUrl("/piese-de-schimb/uleiuri-si-lichide/" + this.selectedMark + "/" + this.selectedModel + "/" + this.selectedEngine);
  }
}
