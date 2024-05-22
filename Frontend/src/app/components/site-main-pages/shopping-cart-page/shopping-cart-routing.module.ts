import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartIndexComponent } from './shopping-cart-index/shopping-cart-index.component';
import { ShoppingCartPaymentsComponent } from './shopping-cart-payments/shopping-cart-payments.component';
import { ShoppingCartCheckoutComponent } from './shopping-cart-checkout/shopping-cart-checkout.component';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartIndexComponent
  },
  {
    path: 'plata',
    component: ShoppingCartPaymentsComponent
  },
  {
    path: 'checkout',
    component: ShoppingCartCheckoutComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule { }
