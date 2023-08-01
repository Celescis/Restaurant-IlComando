import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalDeCocineroPage } from './home-principal-de-cocinero.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalDeCocineroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalDeCocineroPageRoutingModule {}
