import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeMozoPageRoutingModule } from './home-principal-de-mozo-routing.module';

import { HomePrincipalDeMozoPage } from './home-principal-de-mozo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalDeMozoPageRoutingModule
  ],
  declarations: [HomePrincipalDeMozoPage]
})
export class HomePrincipalDeMozoPageModule {}
