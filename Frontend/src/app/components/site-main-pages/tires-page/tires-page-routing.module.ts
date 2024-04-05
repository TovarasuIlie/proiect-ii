import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiresPageComponent } from './tires-page-index/tires-page.component';
import { TiresCategoryListComponent } from './tires-category-list/tires-category-list.component';
import { TirePresentationPageComponent } from './tire-presentation-page/tire-presentation-page.component';

const routes: Routes = [
  {
    path: '',
    component: TiresPageComponent
  },
  {
    path: ':tireCategory',
    component: TiresCategoryListComponent
  },
  {
    path: ':title/:id',
    component: TirePresentationPageComponent
  }
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
export class TiresPageRoutingModule { }
