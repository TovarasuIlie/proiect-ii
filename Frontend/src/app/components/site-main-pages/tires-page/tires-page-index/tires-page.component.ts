import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsService } from '../../../dashboard/services/products.service';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ShippingCartService } from '../../../../services/shipping-cart.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-tires-page',
  templateUrl: './tires-page.component.html',
  styleUrl: './tires-page.component.css'
})
export class TiresPageComponent implements OnInit {
  tires: ProductsInterface[] = [];

  constructor(private titleService: Title, private productService: ProductsService, private shippingCartService: ShippingCartService) {
    this.titleService.setTitle("Anvelope - La Vericu SRL");
  }

  ngOnInit(): void {
    this.productService.getProductsByNamePagination("anvelope", 1, 12).subscribe({
      next: (value) => {
        this.tires = value;
      }
    })
  }

  get4Tires(from: number, to: number) {
    return this.tires.slice(from, to);
  }

  getImage(folderName:string, imageID: string) {
    return environment.apiUrl + '/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

  addProductToCart(productID: number) {
    this.shippingCartService.sendUpdate(productID);
  }
}
