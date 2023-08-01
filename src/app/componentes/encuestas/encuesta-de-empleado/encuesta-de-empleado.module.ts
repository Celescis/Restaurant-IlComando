import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaDeEmpleadoPageRoutingModule } from './encuesta-de-empleado-routing.module';

import { EncuestaDeEmpleadoPage } from './encuesta-de-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaDeEmpleadoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EncuestaDeEmpleadoPage]
})
export class EncuestaDeEmpleadoPageModule { }
