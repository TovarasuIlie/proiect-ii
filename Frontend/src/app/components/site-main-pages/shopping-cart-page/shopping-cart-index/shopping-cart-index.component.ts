import { Component } from '@angular/core';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-shopping-cart-index',
  templateUrl: './shopping-cart-index.component.html',
  styleUrl: './shopping-cart-index.component.css'
})
export class ShoppingCartIndexComponent {
  shoppingList: ShippingCartInterface[] = [
    {
      id: 1,
      product: {
        id: 1,
        title: "test 1",
        description: "adsada",
        category: {
          id: 1,
          name: "categorie Test",
          imageFilename: "niet",
          categoryNameSearch: "test"
        },
        technicalDetailsJson: "adada",
        quantity: 5,
        price: 5635.99
      },
      quantity: 1,
      totalPrice: 5635.99
    },
    {
      id: 2,
      product: {
        id: 14,
        title: "test 2",
        description: "adsada",
        category: {
          id: 1,
          name: "categorie Test",
          imageFilename: "niet",
          categoryNameSearch: "test"
        },
        technicalDetailsJson: "adada",
        quantity: 5,
        price: 2
      },
      quantity: 1,
      totalPrice: 2
    },
    {
      id: 3,
      product: {
        id: 4,
        title: "test 3",
        description: "adsada",
        category: {
          id: 1,
          name: "categorie Test",
          imageFilename: "niet",
          categoryNameSearch: "test"
        },
        technicalDetailsJson: "adada",
        quantity: 5,
        price: 2.99
      },
      quantity: 1,
      totalPrice: 2.99
    }
  ];
  totalBasketPriceWithoutDelivery: number = 0;
  totalBasketPriceWithDelivery: number = 0;
  deliveryPrice: number = 25;

  constructor(private toastService: ToastService) {
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
