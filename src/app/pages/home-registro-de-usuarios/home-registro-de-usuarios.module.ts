import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeRegistroDeUsuariosPageRoutingModule } from './home-registro-de-usuarios-routing.module';

import { HomeRegistroDeUsuariosPage } from './home-registro-de-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRegistroDeUsuariosPageRoutingModule
  ],
  declarations: [HomeRegistroDeUsuariosPage]
})
export class HomeRegistroDeUsuariosPageModule { }
