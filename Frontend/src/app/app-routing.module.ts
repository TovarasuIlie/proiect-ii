import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { TiresPageComponent } from './components/tires-page/tires-page.component';
import { ToolsPageComponent } from './components/tools-page/tools-page.component';

const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: 'anvelope',
    component: TiresPageComponent
  },
  {
    path: 'scule',
    component: ToolsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
