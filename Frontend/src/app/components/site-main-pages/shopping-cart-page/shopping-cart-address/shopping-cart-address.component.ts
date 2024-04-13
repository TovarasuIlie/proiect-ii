import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-shopping-cart-address',
  templateUrl: './shopping-cart-address.component.html',
  styleUrl: './shopping-cart-address.component.css'
})
export class ShoppingCartAddressComponent {
  constructor(public userService: UserService) {}
}
