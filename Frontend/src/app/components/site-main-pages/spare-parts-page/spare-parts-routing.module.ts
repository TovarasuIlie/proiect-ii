import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SparePartsListComponent } from './spare-parts-list/spare-parts-list.component';
import { SparePartsComponent } from './spare-parts/spare-parts.component';
import { ProductsResolverService } from '../../../resolvers/products.resolver';
import { SparePartPresentationComponent } from './spare-part-presentation/spare-part-presentation.component';

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
  },
  {
    path: 'vizualizare-produs/:id',
    component: SparePartPresentationComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SparePartsRoutingModule { }
