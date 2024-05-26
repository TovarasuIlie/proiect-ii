import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './components/site-main-pages/index-page/index-page.component';
import { ToolsPageComponent } from './components/site-main-pages/tools-page/tools-page.component';
import { NotFoundPageComponent } from './components/site-main-pages/not-found-page/not-found-page.component';
import { MotorOilPageComponent } from './components/site-main-pages/motor-oil-page/motor-oil-page.component';
import { AccesoriesPageComponent } from './components/site-main-pages/accesories-page/accesories-page.component';
import { SearchPageComponent } from './components/site-main-pages/search-page/search-page.component';
import { AdminGuard } from './route-guards/admin.guard';
import { AuthorizationGuard } from './route-guards/authorization.guard';
import { SearchProductsResolverService } from './resolvers/search-products.resolver';

const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'anvelope', 
    loadChildren: () => import('./components/site-main-pages/tires-page/tires-page.module').then(module => module.TiresPageModule)
  },
  {
    path: 'scule',
    component: ToolsPageComponent
  },
  {
    path: 'accesorii-auto',
    component: AccesoriesPageComponent
  },
  {
    path: 'ulei-motor',
    component: MotorOilPageComponent
  },
  {
    path: 'piese-de-schimb',
    loadChildren: () => import('./components/site-main-pages/spare-parts-page/spare-parts.module').then(module => module.SparePartsModule)
  },
  {
    path: 'cauta',
    component: SearchPageComponent,
    resolve: {
      searchList: SearchProductsResolverService
    }
  },
  {
    path: 'cont', 
    loadChildren: () => import('./components/account-component/account.module').then(module => module.AccountModule)
  },
  {
    path: 'cosul-meu', 
    loadChildren: () => import('./components/site-main-pages/shopping-cart-page/shopping-cart.module').then(module => module.ShoppingCartModule)
  },
  {
    path: "dashboard",
    loadChildren: () => import('./components/dashboard/admin.module').then(module => module.AdminModule),
    canActivate: [AuthorizationGuard, AdminGuard]
  },
  {
    path: '**',
    redirectTo: "eroarea-404",
    pathMatch: "full",
  },
  {
    path: 'eroarea-404',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
