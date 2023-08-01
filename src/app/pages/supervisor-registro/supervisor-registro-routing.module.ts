import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupervisorRegistroPage } from './supervisor-registro.page';

const routes: Routes = [
  {
    path: '',
    component: SupervisorRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupervisorRegistroPageRoutingModule {}
