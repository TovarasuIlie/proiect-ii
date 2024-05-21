import { Component, OnInit } from '@angular/core';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ToastService } from '../../../shared/services/toast.service';

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

  constructor(private toastService: ToastService) {
    
  }

  ngOnInit(): void {
    const itemsFromCart = localStorage.getItem('shoppingCart');
    if(itemsFromCart == undefined) {
      localStorage.setItem("shoppingCart", JSON.stringify(this.shoppingList));
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
    this.calculateTotalPrice();
  }

  removeProduct(id: number) {
    this.shoppingList.splice(this.shoppingList.findIndex(p => p.id === id), 1);
    console.log(this.shoppingList);
    this.calculateTotalPrice();
  }

}
