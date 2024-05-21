import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiresPageComponent } from './tires-page-index/tires-page.component';

const routes: Routes = [
  {
    path: '',
    component: TiresPageComponent
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
