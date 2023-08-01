import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesaRegistroPageRoutingModule } from './mesa-registro-routing.module';

import { MesaRegistroPage } from './mesa-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesaRegistroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MesaRegistroPage]
})
export class MesaRegistroPageModule { }
