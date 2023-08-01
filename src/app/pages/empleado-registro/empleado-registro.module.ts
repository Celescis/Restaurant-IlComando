import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpleadoRegistroPageRoutingModule } from './empleado-registro-routing.module';

import { EmpleadoRegistroPage } from './empleado-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpleadoRegistroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmpleadoRegistroPage]
})
export class EmpleadoRegistroPageModule { }
