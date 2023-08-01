import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeBartenderPageRoutingModule } from './home-principal-de-bartender-routing.module';

import { HomePrincipalDeBartenderPage } from './home-principal-de-bartender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalDeBartenderPageRoutingModule
  ],
  declarations: [HomePrincipalDeBartenderPage]
})
export class HomePrincipalDeBartenderPageModule {}
