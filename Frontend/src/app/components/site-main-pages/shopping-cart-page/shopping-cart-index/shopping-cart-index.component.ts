import { Component, OnInit } from '@angular/core';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ToastService } from '../../../shared/services/toast.service';
import { UserService } from '../../../../services/user.service';
import { PaginateConfig } from '../../../../models/paginate.model';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-shopping-cart-index',
  templateUrl: './shopping-cart-index.component.html',
  styleUrl: './shopping-cart-index.component.css'
})
export class ShoppingCartIndexComponent implements OnInit {
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

  constructor(private toastService: ToastService, private userService: UserService) {
    
  }

  ngOnInit(): void {
    const itemsFromCart = localStorage.getItem(this.userService.getEmail());
    if(itemsFromCart == undefined) {
      localStorage.setItem(this.userService.getEmail(), JSON.stringify(this.shoppingList));
    } else {
      this.shoppingList = JSON.parse(itemsFromCart);
    }
    this.calculateTotalPrice();
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

  jsonSpecs(id: number) {
    return JSON.parse(this.shoppingList[id].product.technicalDetailsJson);
  }

  getImage(folderName:string, imageID: string) {
    return environment.apiUrl + '/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }

}
