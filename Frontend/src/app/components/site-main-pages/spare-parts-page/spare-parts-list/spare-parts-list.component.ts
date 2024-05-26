import { Component, OnInit } from '@angular/core';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareDataService } from '../../../../services/share-data.service';
import { CategoryInterface } from '../../../dashboard/models/category-interface';
import { ShippingCartService } from '../../../../services/shipping-cart.service';
import { Title } from '@angular/platform-browser';
import { PaginateConfig } from '../../../../models/paginate.model';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-spare-parts-list',
  templateUrl: './spare-parts-list.component.html',
  styleUrl: './spare-parts-list.component.css'
})
export class SparePartsListComponent implements OnInit {
  products: ProductsInterface[] = [];
  errorMessages: string[] = [];
  category!: CategoryInterface;
  currentCategoryPath: string = '';
  paginatorConfig: PaginateConfig = {
    currentPage: 1,
    totalItems: 10,
    itemsPerPage: 10,
    currentPageName: "piese-de-schimb"
  }
  carName!: string;

  constructor(private activatedRoute: ActivatedRoute, private shareData: ShareDataService, private shippingCartService: ShippingCartService, private title: Title) {
    this.activatedRoute.paramMap.subscribe({
      next: (value) => {
        const category = value.get('partCategory');
        if(category) {
          this.currentCategoryPath =  category;
        }  
        const mark = value.get('mark');
        const model = value.get('model');
        const engine = value.get('engine');
        if(mark && model && engine) {
          this.carName = mark + " " + model + " " + engine;
        }
      },
    });
    this.title.setTitle("Piese de schimb - La Vericu' SRL");
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
    this.errorMessages = [];
    this.products = [];
    this.activatedRoute.data.subscribe((response: any) => { 
      if(!(response.productsList instanceof HttpErrorResponse)) {
        response.productsList.map((product: any) => {
          if(!(product.technicalDetailsJson instanceof Array)) {
            product.technicalDetailsJson = JSON.parse(product.technicalDetailsJson);
          }
          this.products.push(product);
        })
      } else {
        this.errorMessages.push(response.productsList.error);
      }
    })
  }

  addProductToCart(productID: number) {
    this.shippingCartService.sendUpdate(productID);
  }

  getImage(folderName:string, imageID: string) {
    return environment.apiUrl + '/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
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
