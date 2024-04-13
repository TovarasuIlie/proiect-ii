import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartIndexComponent } from './shopping-cart-index/shopping-cart-index.component';
import { SharedModule } from '../../shared/shared.module';
import { ShoppingCartAddressComponent } from './shopping-cart-address/shopping-cart-address.component';
import { ShoppingCartPaymentsComponent } from './shopping-cart-payments/shopping-cart-payments.component';
import { ShoppingCartCheckoutComponent } from './shopping-cart-checkout/shopping-cart-checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShoppingCartIndexComponent,
    ShoppingCartAddressComponent,
    ShoppingCartPaymentsComponent,
    ShoppingCartCheckoutComponent
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ShoppingCartModule { }
