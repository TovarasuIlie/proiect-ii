import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { EngineInterface, MarkInterface, ModelInterface } from '../../../models/car.model';

@Component({
  selector: 'app-motor-oil-page',
  templateUrl: './motor-oil-page.component.html',
  styleUrl: './motor-oil-page.component.css'
})
export class MotorOilPageComponent implements OnInit {
  marksList: MarkInterface[] = [];
  modelsList: ModelInterface[] = [];
  enginesList: EngineInterface[] = [];
  
  constructor(private carService: CarService) {}

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
}
