import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiresPageRoutingModule } from './tires-page-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TiresPageComponent } from './tires-page-index/tires-page.component';



@NgModule({
  declarations: [
    TiresPageComponent
  ],
  imports: [
    CommonModule,
    TiresPageRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class TiresPageModule { }
