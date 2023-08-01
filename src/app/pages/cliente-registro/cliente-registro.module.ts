import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClienteRegistroPageRoutingModule } from './cliente-registro-routing.module';

import { ClienteRegistroPage } from './cliente-registro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ClienteRegistroPageRoutingModule
  ],
  declarations: [ClienteRegistroPage]
})
export class ClienteRegistroPageModule { }
