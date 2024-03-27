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



@NgModule({
  declarations: [
    IndexPageComponent,
    AllUsersPageComponent,
    UserDetailsPageComponent,
    AllCategoriesComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminModule { }
