import { Component, OnInit } from '@angular/core';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareDataService } from '../../../../services/share-data.service';
import { CategoryInterface } from '../../../dashboard/models/category-interface';

@Component({
  selector: 'app-spare-parts-list',
  templateUrl: './spare-parts-list.component.html',
  styleUrl: './spare-parts-list.component.css'
})
export class SparePartsListComponent implements OnInit {
  products: ProductsInterface[] = [];
  errorMessages: string[] = [];
  category!: CategoryInterface;
  currentCategoryPath: string = 'anvelope';

  constructor(private activatedRoute: ActivatedRoute, private shareData: ShareDataService, private activeRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe({
      next: (value) => {
        const category = value.get('partCategory');
        if(category) {
          this.currentCategoryPath =  category;
        }
      },
    })
  }
  ngOnInit(): void {
    this.initializeProducts();
    this.shareData.getData().subscribe({
      next: (value) => {
        this.category = value.find((d: CategoryInterface) => d.categoryNameSearch === this.currentCategoryPath)
      },
    })
  }

  initializeProducts() {
    this.activatedRoute.data.subscribe((response: any) => { 
      if(!(response.productsList instanceof HttpErrorResponse)) {
        response.productsList.map((product: any) => {
          product.technicalDetailsJson = JSON.parse(product.technicalDetailsJson);
          this.products.push(product);
        })
      } else {
        this.errorMessages.push(response.productsList.error);
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
