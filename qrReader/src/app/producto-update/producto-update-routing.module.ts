import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoUpdatePage } from './producto-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoUpdatePageRoutingModule {}
