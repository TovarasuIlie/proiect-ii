import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsInterface } from '../../dashboard/models/products.model';
import { ProductsService } from '../../dashboard/services/products.service';
import { ShippingCartService } from '../../../services/shipping-cart.service';
import { Title } from '@angular/platform-browser';
import { PaginateConfig } from '../../../models/paginate.model';
import { environment } from '../../../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})

export class SearchPageComponent implements OnInit {
  keyword!: string;
  errorMessages!: string[];
  products: ProductsInterface[] = [];
  paginatorConfig: PaginateConfig = {
    totalItems: 10,
    itemsPerPage: 10,
    currentPage: 1,
    currentPageName: 'cauta'
  }

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductsService, private shippingCartService: ShippingCartService, private title: Title) {
    this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        this.keyword = value['keyword'];
      }
    });
    this.title.setTitle("Cauti '" + this.keyword + "' - La Vericu' SRL");
  }

  ngOnInit() {
    this.initializeSearch();
  }

  initializeSearch() {
    this.errorMessages = [];
    this.products = [];
    this.activatedRoute.data.subscribe((response: any) => { 
      if(!(response.searchList instanceof HttpErrorResponse)) {
        response.searchList.map((product: any) => {
          if(!(product.technicalDetailsJson instanceof Array)) {
            product.technicalDetailsJson = JSON.parse(product.technicalDetailsJson);
          }
          this.products.push(product);
        })
      } else {
        this.errorMessages.push(response.searchList.error);
      }
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

  getImage(folderName:string, imageID: string) {
    return environment.apiUrl + '/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }
}

