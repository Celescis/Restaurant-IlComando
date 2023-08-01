import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraficosEmpleadosPage } from './graficos-empleados.page';

const routes: Routes = [
  {
    path: '',
    component: GraficosEmpleadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraficosEmpleadosPageRoutingModule {}
