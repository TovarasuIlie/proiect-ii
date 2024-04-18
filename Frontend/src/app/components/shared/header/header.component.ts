import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../services/toast.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';
import { ShippingCartInterface } from '../../../models/shipping-cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  categories: CategoryInterface[] = [];
  shoppingList: ShippingCartInterface[] = [
    {
      id: 1,
      product: {
        id: 1,
        title: "Salut freate vreau sa umplu asta asa la misto",
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


  constructor(private router: Router, public userService: UserService, private toastService: ToastService) {

  }

  ngOnInit(): void {
  }

  logoutUser() {
    this.userService.logOut();
    this.toastService.show({title: "Delogare cu succes", message: "V-ati delogat cu succes!", classname: "text-success"});
  }
}