import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page/profile-page.component';
import { OrdersPageComponent } from './profile-page/orders-page/orders-page.component';
import { WishlistPageComponent } from './profile-page/wishlist-page/wishlist-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { authGuard } from '../../route-guards/auth-guard.guard';
import { noAuthGuard } from '../../route-guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'contul-meu',
    component: ProfilePageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'comenzile-mele',
    component: OrdersPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'wishlist',
    component: WishlistPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'recuperare-parola',
    component: ForgotPasswordPageComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'recuperare-parola/reseteaza',
    component: ResetPasswordPageComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'confirmare-email',
    component: ConfirmEmailComponent,
    // canActivate: [noAuthGuard]
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }