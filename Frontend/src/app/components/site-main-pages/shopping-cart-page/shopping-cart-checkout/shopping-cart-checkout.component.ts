import { Component, OnInit } from '@angular/core';
import { ShareDataService } from '../../../../services/share-data.service';
import { ShippingCartInterface } from '../../../../models/shipping-cart.model';
import { ToastService } from '../../../shared/services/toast.service';
import { computeStyles } from '@popperjs/core';

@Component({
  selector: 'app-shopping-cart-checkout',
  templateUrl: './shopping-cart-checkout.component.html',
  styleUrl: './shopping-cart-checkout.component.css'
})
export class ShoppingCartCheckoutComponent implements OnInit {
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
  currentPage: number = 1;
  itemsPerPage: number = 1;

  constructor(private shareData: ShareDataService, private toastService: ToastService) {
    this.calculateTotalPrice();
  }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('paymentMethod'));
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

  changePage(page: number) {
    this.currentPage = page;
  }

  get paginateData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.shoppingList.slice(start, end);
  }
  
}