import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductoUpdatePageRoutingModule } from './producto-update-routing.module';

import { ProductoUpdatePage } from './producto-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoUpdatePageRoutingModule
  ],
  declarations: [ProductoUpdatePage]
})
export class ProductoUpdatePageModule {}
