import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalDeBartenderPage } from './home-principal-de-bartender.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalDeBartenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalDeBartenderPageRoutingModule {}
