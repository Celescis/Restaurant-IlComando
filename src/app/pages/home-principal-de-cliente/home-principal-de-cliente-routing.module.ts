import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalDeClientePage } from './home-principal-de-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalDeClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalDeClientePageRoutingModule {}
