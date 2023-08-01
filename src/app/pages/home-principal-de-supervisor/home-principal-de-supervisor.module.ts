import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePrincipalDeSupervisorPageRoutingModule } from './home-principal-de-supervisor-routing.module';

import { HomePrincipalDeSupervisorPage } from './home-principal-de-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePrincipalDeSupervisorPageRoutingModule
  ],
  declarations: [HomePrincipalDeSupervisorPage]
})
export class HomePrincipalDeSupervisorPageModule {}
