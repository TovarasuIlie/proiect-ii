import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { IndexPageComponent } from '../dashboard/index-page/index-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllUsersPageComponent } from './users-management/all-users-page/all-users-page.component';
import { UserDetailsPageComponent } from './users-management/user-details-page/user-details-page.component';
import { SharedModule } from '../shared/shared.module';
import { AllCategoriesComponent } from './category-management/all-categories/all-categories.component';
import { ViewProductsPageComponent } from './products-management/view-products-page/view-products-page.component';
import { AddProductsPageComponent } from './products-management/add-products-page/add-products-page.component';
import { ProductsDetailsPageComponent } from './products-management/products-details-page/products-details-page.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { ActiveOrdersComponent } from './orders-management/active-orders/active-orders.component';
import { ViewOrderComponent } from './orders-management/view-order/view-order.component';

registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);

@NgModule({
  declarations: [
    IndexPageComponent,
    AllUsersPageComponent,
    UserDetailsPageComponent,
    AllCategoriesComponent,
    ViewProductsPageComponent,
    AddProductsPageComponent,
    ProductsDetailsPageComponent,
    ActiveOrdersComponent,
    ViewOrderComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FilePondModule
  ]
})
export class AdminModule { }
