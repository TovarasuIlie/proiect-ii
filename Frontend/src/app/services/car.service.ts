import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EngineInterface, MarkInterface, ModelInterface } from '../models/car.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient) { }

  getMarks() {
    return this.http.get<MarkInterface[]>(environment.apiUrl + "/api/Car/get-marks");
  }

  getModels(markID: number) {
    return this.http.get<ModelInterface[]>(environment.apiUrl + "/api/Car/get-mark-models/" + markID);
  }

  getEngines(modelID: number) {
    return this.http.get<EngineInterface[]>(environment.apiUrl + "/api/Car/get-model-engines/" + modelID);
  }
}
