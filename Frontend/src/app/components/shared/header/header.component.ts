import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../services/toast.service';
import { CategoryInterface } from '../../dashboard/models/category-interface';
import { ShippingCartService } from '../../../services/shipping-cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  categories: CategoryInterface[] = [];

  constructor(private router: Router, public userService: UserService, private toastService: ToastService, private shoppingCartService: ShippingCartService) {

  }

  ngOnInit(): void {

  }

  logoutUser() {
    this.userService.logOut();
    this.toastService.show({title: "Delogare cu succes", message: "V-ati delogat cu succes!", classname: "text-success"});
    this.shoppingCartService.logoutSignal();
  }
}