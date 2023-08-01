import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpleadoRegistroPage } from './empleado-registro.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoRegistroPageRoutingModule { }
