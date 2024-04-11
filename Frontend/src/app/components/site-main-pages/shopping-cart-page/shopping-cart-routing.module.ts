import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartIndexComponent } from './shopping-cart-index/shopping-cart-index.component';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartIndexComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ShoppingCartRoutingModule { }
