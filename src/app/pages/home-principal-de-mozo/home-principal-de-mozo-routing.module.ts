import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalDeMozoPage } from './home-principal-de-mozo.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalDeMozoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalDeMozoPageRoutingModule {}
