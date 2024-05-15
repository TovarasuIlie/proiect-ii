import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsInterface } from '../../dashboard/models/products.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  keyword!: string;
  errorMessages!: string[];
  products: ProductsInterface[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        this.keyword = value['keyword'];
      }
    })
  }

  sliceJSONArray(object: any[], from: number, to: number) {
    const returnedObj: any[] = [];
    if(object.length < to) {
      to = object.length;
    }
    for(let i = from; i < to; i++) {
      returnedObj.push(object[i]);
    }
    return returnedObj;
  }
}

