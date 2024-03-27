import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { AdminGuard } from '../../route-guards/admin.guard';
import { AllUsersPageComponent } from './users-management/all-users-page/all-users-page.component';
import { UserDetailsPageComponent } from './users-management/user-details-page/user-details-page.component';
import { AllCategoriesComponent } from './category-management/all-categories/all-categories.component';

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
        component: AllUsersPageComponent
      },
      {
        path: 'utilizatori/detalii-utilizator/:idUser',
        component: UserDetailsPageComponent
      },
      {
        path: 'categorii',
        component: AllCategoriesComponent
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
