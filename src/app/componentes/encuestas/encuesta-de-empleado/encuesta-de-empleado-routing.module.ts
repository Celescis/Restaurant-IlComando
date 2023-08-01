import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestaDeEmpleadoPage } from './encuesta-de-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaDeEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestaDeEmpleadoPageRoutingModule {}
