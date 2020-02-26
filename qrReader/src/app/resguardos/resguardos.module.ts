import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResguardosPageRoutingModule } from './resguardos-routing.module';

import { ResguardosPage } from './resguardos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResguardosPageRoutingModule
  ],
  declarations: [ResguardosPage]
})
export class ResguardosPageModule {}
