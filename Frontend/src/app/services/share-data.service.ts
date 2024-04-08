import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

private data$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

public getData(): Observable<any[]> { 
  return this.data$.asObservable();
 } 
  
public setData(data: any): void { 
  this.data$.next(data);
}

  constructor() { }
}
