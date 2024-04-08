import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiresPageRoutingModule } from './tires-page-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TiresPageComponent } from './tires-page-index/tires-page.component';
import { TiresCategoryListComponent } from './tires-category-list/tires-category-list.component';
import { TirePresentationPageComponent } from './tire-presentation-page/tire-presentation-page.component';



@NgModule({
  declarations: [
    TiresPageComponent,
    TiresCategoryListComponent,
    TirePresentationPageComponent
  ],
  imports: [
    CommonModule,
    TiresPageRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class TiresPageModule { }
