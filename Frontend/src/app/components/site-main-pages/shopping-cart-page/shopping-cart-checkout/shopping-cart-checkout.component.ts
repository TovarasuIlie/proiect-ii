import { Component, OnInit } from '@angular/core';
import { ShareDataService } from '../../../../services/share-data.service';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ToastService } from '../../../shared/services/toast.service';
import { UserService } from '../../../../services/user.service';
import { OrderDetailInterface, OrderInterface } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';
import { Router } from '@angular/router';
import { PaginateConfig } from '../../../../models/paginate.model';

@Component({
  selector: 'app-shopping-cart-checkout',
  templateUrl: './shopping-cart-checkout.component.html',
  styleUrl: './shopping-cart-checkout.component.css'
})
export class ShoppingCartCheckoutComponent implements OnInit {
  shoppingList: ShippingCartInterface[] = [];
  totalBasketPriceWithoutDelivery: number = 0;
  totalBasketPriceWithDelivery: number = 0;
  deliveryPrice: number = 25;
  paginatorConfig: PaginateConfig = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 10,
    currentPageName: "checkout"
  }
  orderDetails: OrderDetailInterface[] = [];

  constructor(private toastService: ToastService, public userService: UserService, private orderService: OrderService, private router: Router) {
    
  }

  ngOnInit(): void {
    const itemsFromCart = localStorage.getItem(this.userService.getEmail());
    if(itemsFromCart == undefined) {
      localStorage.setItem(this.userService.getEmail(), JSON.stringify(this.shoppingList));
    } else {
      this.shoppingList = JSON.parse(itemsFromCart);
    }
    this.shoppingList.forEach((item) => {
      const newItem: OrderDetailInterface = {
        productId: item.product.id,
        quantity: item.quantity
      }
      this.orderDetails.push(newItem);
    })
    this.calculateTotalPrice();
  }

  getJson(string: string) {
    return JSON.parse(string);
  }

  calculateTotalPrice() {
    this.totalBasketPriceWithoutDelivery = 0;
    this.shoppingList.forEach((item) => {
      this.totalBasketPriceWithoutDelivery += item.totalPrice;
    });
    this.totalBasketPriceWithDelivery = this.deliveryPrice + this.totalBasketPriceWithoutDelivery;
  }

  plus(id: number) {
    const shopping = this.shoppingList.filter(p => p.id === id)[0];
    const productPrice = shopping.product.price;
    const productQuantity = shopping.product.quantity;
    if(productPrice !== null && productQuantity !== null) {
      if(shopping.quantity < productQuantity) {
        shopping.quantity++;
        this.shoppingList.filter(p => p.id === id)[0].totalPrice = shopping.quantity * productPrice;
      } else {
        this.toastService.show({title: "Lipsa stoc produs!", message: "Produsul selectat nu are indeajuns stoc!", classname: "text-danger"})
      }
    }
    this.shoppingList.filter(p => p.id === id)[0] = shopping;
    localStorage.setItem(this.userService.getEmail(), JSON.stringify(this.shoppingList));
    this.calculateTotalPrice();
  }

  minus(id: number) {
    const shopping = this.shoppingList.filter(p => p.id === id)[0];
    const productPrice = shopping.product.price;
    const productQuantity = shopping.product.quantity;
    if(productPrice !== null && productQuantity !== null) {
      if(shopping.quantity > 1) {
        shopping.quantity--;
        this.shoppingList.filter(p => p.id === id)[0].totalPrice = shopping.quantity * productPrice;
      }
    }
    this.shoppingList.filter(p => p.id === id)[0] = shopping;
    localStorage.setItem(this.userService.getEmail(), JSON.stringify(this.shoppingList));
    this.calculateTotalPrice();
  }

  removeProduct(id: number) {
    this.shoppingList.splice(this.shoppingList.findIndex(p => p.id === id), 1);
    console.log(this.shoppingList);
    this.calculateTotalPrice();
  }

  changePage(page: number) {
    this.paginatorConfig.currentPage = page;
  }

  get paginateData() {
    const start = (this.paginatorConfig.currentPage - 1) * this.paginatorConfig.currentPage;
    const end = start + this.paginatorConfig.itemsPerPage;

    return this.shoppingList.slice(start, end);
  }

  submitOrder() {
    this.orderService.newOrder(this.userService.getID(), this.orderDetails, this.totalBasketPriceWithDelivery).subscribe({
      next: (response) => {
        localStorage.removeItem(this.userService.getEmail());
        this.router.navigateByUrl('/');
        this.toastService.show({title: "Comanda plasata!", message: "Comanda a fost plasata cu succes!", classname:"text-success"});
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  getImage(folderName:string, imageID: string) {
    return 'http://localhost:5020/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }
  
}
