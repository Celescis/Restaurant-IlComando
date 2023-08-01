import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePrincipalDeSupervisorPage } from './home-principal-de-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: HomePrincipalDeSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePrincipalDeSupervisorPageRoutingModule {}
