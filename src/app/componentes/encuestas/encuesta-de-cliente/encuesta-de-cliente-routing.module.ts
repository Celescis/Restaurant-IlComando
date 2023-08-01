import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncuestaDeClientePage } from './encuesta-de-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: EncuestaDeClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncuestaDeClientePageRoutingModule {}
