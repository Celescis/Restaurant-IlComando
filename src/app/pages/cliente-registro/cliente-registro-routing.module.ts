import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClienteRegistroPage } from './cliente-registro.page';

const routes: Routes = [
  {
    path: '',
    component: ClienteRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteRegistroPageRoutingModule {}
