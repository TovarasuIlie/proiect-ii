import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderInterface } from '../../../models/order.model';
import { ProductsInterface } from '../../dashboard/models/products.model';
import { ProductsService } from '../../dashboard/services/products.service';
import { UserService } from '../../../services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css'
})
export class ViewOrderComponent implements OnInit {
  orderID: number = 0;
  order!: OrderInterface;
  products: ProductsInterface[] = [];

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductsService, public userService: UserService, private title: Title) {
    this.title.setTitle("Contul meu - La Vericu' SRL");
  }

  ngOnInit(): void {
    this.initializeOrder();
    this.initializeProductsList();

  }

  initializeOrder() {
    this.activatedRoute.data.subscribe((response: any) => { 
      this.order = response.order;
    });
  }

  initializeProductsList() {
    this.order.orderDetails.forEach((item) => {
      this.productService.getProduct(item.productId).subscribe({
        next: (value) => {
          this.products.push(value);
        }
      })
    });
  }

  getImage(folderName:string, imageID: string) {
    return 'http://localhost:5020/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

  calculatePrice(numberOfProducts: number, price: number) {
    return numberOfProducts * price;
  }
}
