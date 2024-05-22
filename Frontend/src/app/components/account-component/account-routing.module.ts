import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page/profile-page.component';
import { OrdersPageComponent } from './profile-page/orders-page/orders-page.component';
import { WishlistPageComponent } from './profile-page/wishlist-page/wishlist-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { AuthorizationGuard } from '../../route-guards/authorization.guard';
import { ViewOrderComponent } from './view-order/view-order.component';
import { OrderResolverService } from '../../resolvers/orders.resolver';

const routes: Routes = [
  {
    path: 'contul-meu',
    component: ProfilePageComponent,
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'comenzile-mele',
    component: OrdersPageComponent,
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'comenzile-mele/vezi-comanda/:id',
    component: ViewOrderComponent,
    canActivate: [AuthorizationGuard],
    resolve: {
      order: OrderResolverService 
    }
  },
  {
    path: 'wishlist',
    component: WishlistPageComponent,
    canActivate: [AuthorizationGuard]
  },
  {
    path: 'recuperare-parola',
    component: ForgotPasswordPageComponent,
  },
  {
    path: 'recuperare-parola/reseteaza',
    component: ResetPasswordPageComponent,
  },
  {
    path: 'confirmare-email',
    component: ConfirmEmailComponent,
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
