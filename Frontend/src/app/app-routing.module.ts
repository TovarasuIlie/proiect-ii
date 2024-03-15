import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { TiresPageComponent } from './components/tires-page/tires-page.component';
import { ToolsPageComponent } from './components/tools-page/tools-page.component';
import { CarPartsComponent } from './components/car-parts-page/car-parts/car-parts.component';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './components/templates/not-found-page/not-found-page.component';
import { DashboardIndexPageComponent } from './components/dashboard/index-page/index-page.component';
import { OrdersPageComponent } from './components/profile-page/orders-page/orders-page.component';
import { ProfilePageComponent } from './components/profile-page/profile-page/profile-page.component';
import { WishlistPageComponent } from './components/profile-page/wishlist-page/wishlist-page.component';

const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: 'anvelope',
    component: TiresPageComponent
  },
  {
    path: 'scule',
    component: ToolsPageComponent
  },
  {
    path: 'piese-auto/:carMark',
    component: CarPartsComponent
  },
  {
    path: 'dashboard',
    component: DashboardIndexPageComponent
  },
  {
    path: 'profil/contul-meu',
    component: ProfilePageComponent
  },
  {
    path: 'profil/comenzile-mele',
    component: OrdersPageComponent
  },
  {
    path: 'profil/wishlist',
    component: WishlistPageComponent
  },
  {
    path: '**',
    pathMatch: "full",
    component: NotFoundPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
