import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaDeClientePageRoutingModule } from './encuesta-de-cliente-routing.module';

import { EncuestaDeClientePage } from './encuesta-de-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaDeClientePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EncuestaDeClientePage]
})
export class EncuestaDeClientePageModule { }
