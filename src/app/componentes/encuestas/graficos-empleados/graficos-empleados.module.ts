import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraficosEmpleadosPageRoutingModule } from './graficos-empleados-routing.module';

import { GraficosEmpleadosPage } from './graficos-empleados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraficosEmpleadosPageRoutingModule
  ],
  declarations: [GraficosEmpleadosPage]
})
export class GraficosEmpleadosPageModule {}
