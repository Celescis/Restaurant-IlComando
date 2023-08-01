import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeClientePageRoutingModule } from './home-principal-de-cliente-routing.module';

import { HomePrincipalDeClientePage } from './home-principal-de-cliente.page';
import { RouteService } from 'src/app/servicios/route-service.service';
import { GraficosClientesPage } from '../graficos-clientes/graficos-clientes.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalDeClientePageRoutingModule,

  ],
  declarations: [HomePrincipalDeClientePage, GraficosClientesPage],
  providers: [RouteService]
})
export class HomePrincipalDeClientePageModule { }
