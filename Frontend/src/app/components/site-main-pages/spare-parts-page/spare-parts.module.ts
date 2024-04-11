import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SparePartsComponent } from './spare-parts/spare-parts.component';
import { SparePartsListComponent } from './spare-parts-list/spare-parts-list.component';
import { SparePartsRoutingModule } from './spare-parts-routing.module';

@NgModule({
  declarations: [
    SparePartsComponent,
    SparePartsListComponent
  ],
  imports: [
    CommonModule,
    SparePartsRoutingModule
  ]
})
export class SparePartsModule { }
