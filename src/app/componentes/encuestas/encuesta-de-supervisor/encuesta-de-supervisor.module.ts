import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaDeSupervisorPageRoutingModule } from './encuesta-de-supervisor-routing.module';

import { EncuestaDeSupervisorPage } from './encuesta-de-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaDeSupervisorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EncuestaDeSupervisorPage]
})
export class EncuestaDeSupervisorPageModule { }
