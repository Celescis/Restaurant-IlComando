import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraficosClientesPage } from './graficos-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: GraficosClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraficosClientesPageRoutingModule {}
