import { Component, Input, OnInit } from '@angular/core';
import { ShippingCartInterface } from '../../../models/shipping-cart.model';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ShippingCartService } from '../../../services/shipping-cart.service';
import { ProductsService } from '../../dashboard/services/products.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
  shoppingList: ShippingCartInterface[] = [];
  totalCartPrice: number = 0;
  totalItems: number = 0;
  private subscription: Subscription;
  @Input() 
    get loginSignal() {
      return true;
    }

  constructor(public userService: UserService, private shippingCartService: ShippingCartService, private productService: ProductsService, private toastService: ToastService) {
    this.subscription = this.shippingCartService.getUpdate().subscribe({
      next: (value) => {
        this.addProductToCart(value);
      }
    })
  }

  ngOnInit(): void {
    this.initializeCart();
  }

  initializeCart() {
    if(this.userService.getEmail() !== null) {
      this.totalCartPrice = 0;
      const itemsFromCart = localStorage.getItem(this.userService.getEmail());
      if(itemsFromCart == undefined) {
        localStorage.setItem(this.userService.getEmail(), JSON.stringify(this.shoppingList));
      } else {
        this.shoppingList = JSON.parse(itemsFromCart);
      }
      this.shoppingList.forEach((item) => {
        this.totalCartPrice = this.totalCartPrice + item.totalPrice;
      })
      this.totalItems = this.shoppingList.length;
    }
  }

  addProductToCart(productID: number) {
      this.productService.getProduct(productID).subscribe({
        next: (value) => {
          let itemsFromCart = JSON.parse(localStorage.getItem(this.userService.getEmail()) || "");
          let item = itemsFromCart.findIndex((p:any) => p.product.id == productID) 
          if(item != -1) {
            if(value.quantity >= itemsFromCart[item].quantity + 1) {
              itemsFromCart[item].quantity ++;
              itemsFromCart[item].totalPrice = itemsFromCart[item].quantity * itemsFromCart[item].product.price;
              localStorage.setItem(this.userService.getEmail(), JSON.stringify(itemsFromCart));
              this.toastService.show({title: "Produs adaugat", message: "Produsul a fost adaugat in cos!", classname: "text-success"});
            } else {
              this.toastService.show({title: "Lipsa stoc", message: "Din produsul nu mai este pe stoc!", classname: "text-danger"});
            }
          } else {
            if(value.quantity >= 1) {
              const item: ShippingCartInterface = {
                id: itemsFromCart.length,
                product: value,
                quantity: 1,
                totalPrice: value.price || 0
              }
              itemsFromCart.push(item);
              localStorage.setItem(this.userService.getEmail(), JSON.stringify(itemsFromCart));
              this.toastService.show({title: "Produs adaugat", message: "Produsul a fost adaugat in cos!", classname: "text-success"});
            } else {
              this.toastService.show({title: "Lipsa stoc", message: "Din produsul nu mai este pe stoc!", classname: "text-danger"});
            }
          }
        }
      });
    setTimeout(() => {
      this.initializeCart();
    }, 100);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeFromList(index: number) {
    const id = this.shoppingList.findIndex(p => p.id === index);
    this.totalCartPrice -= this.shoppingList[id].totalPrice;
    this.shoppingList.splice(id , 1)
    localStorage.setItem(this.userService.getEmail(), JSON.stringify(this.shoppingList));
    this.totalItems = this.shoppingList.length;
  }

  getImage(folderName:string, imageID: string) {
    return 'http://localhost:5020/SiteUploads/ShopImages/' + folderName + "/" + folderName + "_" + imageID + ".png";
  }
}
