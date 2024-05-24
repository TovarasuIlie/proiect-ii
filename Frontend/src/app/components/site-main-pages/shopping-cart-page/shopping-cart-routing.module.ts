import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartIndexComponent } from './shopping-cart-index/shopping-cart-index.component';
import { ShoppingCartPaymentsComponent } from './shopping-cart-payments/shopping-cart-payments.component';
import { ShoppingCartCheckoutComponent } from './shopping-cart-checkout/shopping-cart-checkout.component';
import { CartGuard } from '../../../route-guards/cart.guard';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartIndexComponent
  },
  {
    path: 'plata',
    component: ShoppingCartPaymentsComponent,
    canActivate: [CartGuard]
  },
  {
    path: 'checkout',
    component: ShoppingCartCheckoutComponent,
    canActivate: [CartGuard]
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule { }
