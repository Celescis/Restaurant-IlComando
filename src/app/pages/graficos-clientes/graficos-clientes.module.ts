import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraficosClientesPageRoutingModule } from './graficos-clientes-routing.module';

import { GraficosClientesPage } from './graficos-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraficosClientesPageRoutingModule
  ],
  declarations: [GraficosClientesPage]
})
export class GraficosClientesPageModule {}
