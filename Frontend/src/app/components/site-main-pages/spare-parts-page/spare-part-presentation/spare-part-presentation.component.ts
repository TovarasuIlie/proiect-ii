import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../dashboard/services/products.service';
import { ProductsInterface } from '../../../dashboard/models/products.model';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ShippingCartService } from '../../../../services/shipping-cart.service';
import { Title } from '@angular/platform-browser';

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
  photoLinks: string[] = ['test', 'test', 'test', 'test'];

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductsService, private shippingCartService: ShippingCartService, private title: Title) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.productID = params["id"];
      }
    })
    this.productService.getProduct(this.productID).subscribe({
      next: (value) => {
        this.product = value;
        this.product.technicalDetailsJson = JSON.parse(value.technicalDetailsJson);
        this.title.setTitle(value.title + " - La Vericu' SRL")
      }
    });
  }

  addProductToCart(productID: number) {
    this.shippingCartService.sendUpdate(productID);
  }

  getImage(folderName:string, imageID: string) {
    return 'http://localhost:5020/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

}
