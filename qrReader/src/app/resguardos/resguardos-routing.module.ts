import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResguardosPage } from './resguardos.page';

const routes: Routes = [
  {
    path: '',
    component: ResguardosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResguardosPageRoutingModule {}
