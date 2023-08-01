import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupervisorRegistroPageRoutingModule } from './supervisor-registro-routing.module';

import { SupervisorRegistroPage } from './supervisor-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SupervisorRegistroPageRoutingModule
  ],
  declarations: [SupervisorRegistroPage]
})
export class SupervisorRegistroPageModule { }
