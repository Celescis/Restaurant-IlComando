import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeRegistroDeUsuariosPage } from './home-registro-de-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: HomeRegistroDeUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRegistroDeUsuariosPageRoutingModule { }
