import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SparePartsListComponent } from './spare-parts-list/spare-parts-list.component';
import { SparePartsComponent } from './spare-parts/spare-parts.component';
import { ProductsResolverService } from '../../../resolvers/products.resolver';

const routes: Routes = [
  {
    path: '',
    component: SparePartsComponent
  },
  {
    path: ':partCategory',
    component: SparePartsListComponent,
    resolve: {
      productsList: ProductsResolverService
    }
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SparePartsRoutingModule { }
