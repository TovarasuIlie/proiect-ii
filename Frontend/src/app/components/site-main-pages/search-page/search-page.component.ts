import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsInterface } from '../../dashboard/models/products.model';
import { ProductsService } from '../../dashboard/services/products.service';
import { ShippingCartService } from '../../../services/shipping-cart.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  keyword!: string;
  errorMessages!: string[];
  products: ProductsInterface[] = [];

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductsService, private shippingCartService: ShippingCartService) {
    this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        this.keyword = value['keyword'];
        console.log(value);
        this.initializeSearch();
      }
    })
  }

  initializeSearch() {
    this.products = [];
    this.productService.getProductsByName(this.keyword).subscribe({
      next: (response) => {
        response.forEach(p => {
          p.technicalDetailsJson = JSON.parse(p.technicalDetailsJson);
          this.products.push(p);
        })
      },
    });
    if(this.products.length == 0 ) {
      this.errorMessages.pop();
      this.errorMessages.push("Nu s-a gasit nici un produs!");
    }
  }

  addProductToCart(productID: number) {
    this.shippingCartService.sendUpdate(productID);
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

