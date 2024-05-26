import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { AdminGuard } from '../../route-guards/admin.guard';
import { AllUsersPageComponent } from './users-management/all-users-page/all-users-page.component';
import { UserDetailsPageComponent } from './users-management/user-details-page/user-details-page.component';
import { AllCategoriesComponent } from './category-management/all-categories/all-categories.component';
import { ViewProductsPageComponent } from './products-management/view-products-page/view-products-page.component';
import { AddProductsPageComponent } from './products-management/add-products-page/add-products-page.component';
import { ProductsDetailsPageComponent } from './products-management/products-details-page/products-details-page.component';
import { ActiveOrdersComponent } from './orders-management/active-orders/active-orders.component';
import { ViewOrderComponent } from './orders-management/view-order/view-order.component';
import { OrderResolverService } from '../../resolvers/orders.resolver';
import { CategoryCountResolverService } from '../../resolvers/category-count.resolver';
import { MembersCountResolverService } from '../../resolvers/member-count.resolver';
import { ProductsForCarResolverService } from '../../resolvers/products-for-car.resolver';
import { ProductsCountResolverService } from '../../resolvers/products-count.resolver';

const routes: Routes = [
  {
    path: '',
    runGuardsAndResolvers: "always",
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: IndexPageComponent
      },
      {
        path: 'utilizatori',
        component: AllUsersPageComponent,
        resolve : {
          membersNumber: MembersCountResolverService
        }
      },
      {
        path: 'utilizatori/detalii-utilizator/:idUser',
        component: UserDetailsPageComponent
      },
      {
        path: 'categorii',
        component: AllCategoriesComponent,
        resolve: {
          categoryNumber: CategoryCountResolverService
        }
      },
      {
        path: 'produse',
        component: ViewProductsPageComponent, 
        resolve: {
          productsNumber: ProductsCountResolverService
        }
      },
      {
        path: 'produse/adauga-produs',
        component: AddProductsPageComponent
      },
      {
        path: 'produse/detalii-produs/:id',
        component: ProductsDetailsPageComponent
      },
      {
        path: 'comenzi-active',
        component: ActiveOrdersComponent
      },
      {
        path: 'comenzi-active/comanda/:id',
        component: ViewOrderComponent,
        resolve: {
          order: OrderResolverService 
        }
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
