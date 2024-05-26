import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../dashboard/services/products.service';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ShippingCartService } from '../../../../services/shipping-cart.service';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-spare-part-presentation',
  templateUrl: './spare-part-presentation.component.html',
  styleUrl: './spare-part-presentation.component.css'
})
export class SparePartPresentationComponent {
  productID: number = 0;
  product: ProductsInterface = {
    id: 0,
    title: "",
    description: "",
    technicalDetailsJson: "",
    price: 0,
    quantity: 0,
    category: null,
    folderName: "",
    photoNumber: 0,
  };
  cars: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductsService, private shippingCartService: ShippingCartService, private title: Title) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.productID = params["id"];
      }
    })
    this.productService.getProduct(this.productID).subscribe({
      next: (value: any) => {
        this.cars = value.value.cars;
        this.product = value.value.product;
        this.product.technicalDetailsJson = JSON.parse(value.value.product.technicalDetailsJson);
        this.title.setTitle(value.value.product.title + " - La Vericu' SRL")
      }
    });
  }

  addProductToCart(productID: number) {
    this.shippingCartService.sendUpdate(productID);
  }

  getImage(folderName:string, imageID: string) {
    return environment.apiUrl + '/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

}
