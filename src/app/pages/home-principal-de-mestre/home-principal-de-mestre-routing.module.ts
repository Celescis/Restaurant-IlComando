import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalDeMestrePage } from './home-principal-de-mestre.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalDeMestrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalDeMestrePageRoutingModule {}
