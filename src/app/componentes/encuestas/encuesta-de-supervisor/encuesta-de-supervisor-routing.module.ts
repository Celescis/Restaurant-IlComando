import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestaDeSupervisorPage } from './encuesta-de-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaDeSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestaDeSupervisorPageRoutingModule {}
