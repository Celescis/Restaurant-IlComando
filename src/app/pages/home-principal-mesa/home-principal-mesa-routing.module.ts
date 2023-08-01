import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalMesaPage } from './home-principal-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalMesaPageRoutingModule {}
