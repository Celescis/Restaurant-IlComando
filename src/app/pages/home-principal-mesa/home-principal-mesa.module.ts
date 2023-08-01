import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalMesaPageRoutingModule } from './home-principal-mesa-routing.module';

import { HomePrincipalMesaPage } from './home-principal-mesa.page';
import { DiferenciaMinutosPipe } from 'src/app/pipes/diferencia-minutos.pipe';
import { HomePagarCuentaComponent } from 'src/app/componentes/home-pagar-cuenta/home-pagar-cuenta.component';
import { CartaComponent } from 'src/app/componentes/carta/carta.component';
import { HomeDejarPropinaComponent } from 'src/app/componentes/home-dejar-propina/home-dejar-propina.component';
import { JuegoDiezDeDescuentoComponent } from 'src/app/componentes/juegos/juego-diez-de-descuento/juego-diez-de-descuento.component';
import { JuegoQuinceDeDescuentoComponent } from 'src/app/componentes/juegos/juego-quince-de-descuento/juego-quince-de-descuento.component';
import { JuegoVeinteDeDescuentoComponent } from 'src/app/componentes/juegos/juego-veinte-de-descuento/juego-veinte-de-descuento.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalMesaPageRoutingModule
  ],
  declarations: [HomePrincipalMesaPage, CartaComponent, DiferenciaMinutosPipe, HomePagarCuentaComponent, HomeDejarPropinaComponent, JuegoDiezDeDescuentoComponent, JuegoQuinceDeDescuentoComponent, JuegoVeinteDeDescuentoComponent]
})
export class HomePrincipalMesaPageModule { }
