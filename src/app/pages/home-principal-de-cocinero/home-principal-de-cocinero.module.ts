import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeCocineroPageRoutingModule } from './home-principal-de-cocinero-routing.module';

import { HomePrincipalDeCocineroPage } from './home-principal-de-cocinero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalDeCocineroPageRoutingModule
  ],
  declarations: [HomePrincipalDeCocineroPage]
})
export class HomePrincipalDeCocineroPageModule {}
