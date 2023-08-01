import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeMestrePageRoutingModule } from './home-principal-de-mestre-routing.module';

import { HomePrincipalDeMestrePage } from './home-principal-de-mestre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalDeMestrePageRoutingModule
  ],
  declarations: [HomePrincipalDeMestrePage]
})
export class HomePrincipalDeMestrePageModule {}
