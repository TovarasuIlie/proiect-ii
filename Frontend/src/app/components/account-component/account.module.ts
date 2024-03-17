import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { OrdersPageComponent } from './profile-page/orders-page/orders-page.component';
import { ProfilePageComponent } from './profile-page/profile-page/profile-page.component';
import { WishlistPageComponent } from './profile-page/wishlist-page/wishlist-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from '../shared/header/header.component';


@NgModule({
  declarations: [
    OrdersPageComponent,
    ProfilePageComponent,
    WishlistPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AccountModule { }
