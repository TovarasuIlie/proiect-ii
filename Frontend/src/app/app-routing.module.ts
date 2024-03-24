import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { TiresPageComponent } from './components/tires-page/tires-page.component';
import { ToolsPageComponent } from './components/tools-page/tools-page.component';
import { CarPartsComponent } from './components/car-parts-page/car-parts/car-parts.component';
import { DashboardIndexPageComponent } from './components/dashboard/index-page/index-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { adminGuard } from './route-guards/admin-guard.guard';
import { authGuard } from './route-guards/auth-guard.guard';
import { MotorOilPageComponent } from './components/motor-oil-page/motor-oil-page.component';

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
    component: TiresPageComponent
  },
  {
    path: 'scule',
    component: ToolsPageComponent
  },
  {
    path: 'ulei-motor',
    component: MotorOilPageComponent
  },
  {
    path: 'piese-auto/:carMark',
    component: CarPartsComponent
  },
  {
    path: 'dashboard',
    component: DashboardIndexPageComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'cont', 
    loadChildren: () => import('./components/account-component/account.module').then(module => module.AccountModule)
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
