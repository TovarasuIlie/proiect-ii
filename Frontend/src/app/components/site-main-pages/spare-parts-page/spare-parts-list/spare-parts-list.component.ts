import { Component, OnInit } from '@angular/core';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spare-parts-list',
  templateUrl: './spare-parts-list.component.html',
  styleUrl: './spare-parts-list.component.css'
})
export class SparePartsListComponent implements OnInit {
  products: ProductsInterface[] = [];

  constructor(private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.initializeProducts();
  }

  initializeProducts() {
    this.activatedRoute.data.subscribe((response: any) => { 
      response.productsList.map((product: any) => {
        product.technicalDetailsJson = JSON.parse(product.technicalDetailsJson);
        this.products.push(product);
      })
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
